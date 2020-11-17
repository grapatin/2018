import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { timingSafeEqual } from "crypto";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

function inputData(typeOfData: String) {
    let returnData: string;
    //load data    
    if (typeOfData.startsWith('T1_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle1_ex[+num];
    }
    if (typeOfData.startsWith('T2_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle1_ex[+num];
    }
    switch (typeOfData) {
        case 'PartA':
        case 'PartB':
            let fileString = fs.readFileSync('./puzzleInput1.txt', 'utf8');
            returnData = fileString;
            //console.log('Puzzle input', returnData);
            break;
        default:
            break;
    }
    return returnData;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<Array<String>> = new Array();


    let rows = rawInput.split('\n');

    rows.forEach(row => {
        let charArray: Array<string> = new Array();
        charArray = row.split('');
        inputArray.push(charArray);
    })

    return inputArray;
}



class MagicForest {
    forest: Array<Array<string>>;
    tempForest: Array<Array<string>>;
    constructor(forest) {
        this.forest = forest;
    }
    xSurround = [-1, -1, -1, 0, 1, 1, 1, 0]; //(left side first, top, rigth, down)
    ySurround = [1, 0, -1, -1, -1, 0, 1, 1]; //(left side first, top, rigth, down)
    grow() {
        //Create local copy of forest
        this.tempForest = this.forest.map(function (row) {
            return row.slice();
        });

        //. = open
        //| = tree
        //# = lumberyard
        for (let y = 0; y < this.forest.length; y++) {
            let row = this.forest[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.forest[y][x];
                let numberOfTree = 0;
                let numberOfOpen = 0;
                let numberOfLumber = 0;

                this.xSurround.forEach((xDelta, index) => {
                    let yDelta = this.ySurround[index];
                    let xTemp = x + xDelta;
                    let yTemp = y + yDelta;
                    if ((xTemp > -1) && (yTemp > -1) && (xTemp < row.length) && (yTemp < this.forest.length)) {
                        let checkChar = this.forest[yTemp][xTemp];
                        switch (checkChar) {
                            case '.':
                                numberOfOpen++;
                                break;
                            case '|':
                                numberOfTree++;
                                break;
                            case '#':
                                numberOfLumber++;
                                break;
                        }
                    }
                });
                switch (char) {
                    case '.':
                        if (numberOfTree > 2) {
                            this.tempForest[y][x] = '|';
                        }
                        break;
                    case '|':
                        if (numberOfLumber > 2) {
                            this.tempForest[y][x] = '#';
                        }
                        break;
                    case '#':
                        if ((numberOfLumber > 0) && (numberOfTree > 0)) {
                            this.tempForest[y][x] = '#';
                        } else {
                            this.tempForest[y][x] = '.';
                        }
                        break;
                }
            }
        }
        this.forest = this.tempForest;
        //An open acre will become filled with trees if three or more adjacent acres contained trees. Otherwise, nothing happens.
        //An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards. Otherwise, nothing happens.
        //An acre containing a lumberyard will remain a lumberyard if it was adjacent to at least one other lumberyard and at least one acre containing trees. 
        //Otherwise, it becomes open.
        //calculate
        //swap tempForest to forest
    }

    printForest() {
        writeFile.writeArrayOfArray(this.forest);
    }
    countScore(): number {

        //. = open
        //| = tree
        //# = lumberyard
        let numberOfTree = 0;
        let numberOfOpen = 0;
        let numberOfLumber = 0;
        for (let y = 0; y < this.forest.length; y++) {
            let row = this.forest[y];
            for (let x = 0; x < row.length; x++) {
                let char = this.forest[y][x];
                switch (char) {
                    case '.':
                        numberOfOpen++;
                        break;
                    case '|':
                        numberOfTree++;
                        break;
                    case '#':
                        numberOfLumber++;
                        break;
                }
            }
        }
        return numberOfLumber * numberOfTree;
    }
}

function partA(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);
    const minutes = 10;
    let forest = new MagicForest(input);
    forest.printForest();

    for (let i = 0; i < minutes; i++) {
        forest.grow();
        forest.printForest();
    }
    
    return forest.countScore();
}

function partB(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);
    const minutes = 10000;
    let forest = new MagicForest(input);
    forest.printForest();

    for (let i = 0; i < minutes; i++) {
        forest.grow();
        forest.printForest();
    }

    //check to find repeating pattern.
    let score = 0;
    let scoreMap: Map<number, number> = new Map;
    let firstRepeat = 0;
    let secondRepeat = 0;
    for (let j = minutes; j < minutes + 100; j++) {
        forest.grow();
        score = forest.countScore();
        if (scoreMap.has(score)) {
            if (firstRepeat == 0) {
                firstRepeat = j;
            } else if (secondRepeat == 0) {
                secondRepeat = j;
            }
        } else {
            scoreMap.set(score, j);
        }
    }

    if (firstRepeat == (secondRepeat - 1)) {
        //we have a repeating pattern after 
        let currentPassedMin = minutes + 100;
        let repeatingPatternAfter = firstRepeat - minutes;
        let thisManyMinutesAreLeft = 1000000000 - currentPassedMin;
        let ModuloWithPattern = thisManyMinutesAreLeft % repeatingPatternAfter;
        console.log('Pattern found at', repeatingPatternAfter);

        console.log('Final score is the same as at number of mins=', currentPassedMin + ModuloWithPattern);
    }

    return score;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA'); //Answer is between 267592 and 270165
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB');
    console.log('Puzzle part 2 solution is', resultPart2);


    function TestsForPart2() {
        for (let i = 0; i < puzzle2_number_of_test; i++) {
            let testCalc = partB('T2_' + i);
            if (testCalc == puzzle2_resultex[i]) {
                console.log('Puzzle part 2 example', i, 'passed');
            } else {
                console.log('Puzzle part 2 example', i, 'failed got', testCalc, 'expected', puzzle2_resultex[i]);
            }
        }
    }

    function TestsForPart1() {
        for (let i = 0; i < puzzle1_number_of_test; i++) {
            let testCalc = partA('T1_' + i);
            if (testCalc == puzzle1_resultex[i]) {
                console.log('Puzzle part 1 example', i, 'passed');
            } else {
                console.log('Puzzle part 1 example', i, 'failed got', testCalc, 'expected', puzzle1_resultex[i]);
            }
        }
    }
}
main();
