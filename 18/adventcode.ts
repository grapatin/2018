import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
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
    forest: Array<Array<string>>
    constructor(forest) {
        this.forest = forest;
    }
    grow() {
        //copy forst to temp
        //calculate
        //swap temp to temp
    }

    printForest() {
        writeFile.writeArrayOfArray(this.forest);
    }
    countScore(): number {
        return 0
    }
}

function partA(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);
    const seconds = 0;
    let forest = new MagicForest(input);

    for (let i = 0; i < seconds; i++) {
        forest.grow();
        forest.printForest();
    }
    
    return forest.countScore();
}

function partB(typeOfData: string): number {
    let input: Array<Array<String>> = processInput(typeOfData);

    return 0;
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
