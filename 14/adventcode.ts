import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
const readFile = util.promisify(fs.readFile);


function inputData(typeOfData: String) {
    let returnData: string;
    //load data    
    switch (typeOfData) {
        case 'Test1':
            returnData = puzzle1_ex1;
            break;
        case 'Test2':
            returnData = puzzle1_ex2;
            break;
        case 'Test3':
            returnData = puzzle1_ex3;
            break;
        case 'Part2Test1':
            returnData = puzzle2_ex1;
            break;
        case 'Part2Test2':
            returnData = puzzle2_ex2;
            break;
        case 'Part2Test3':
            returnData = puzzle2_ex3;
            break;
        case 'PartA':
        case 'PartB':
            let fileString = fs.readFileSync('./puzzleInput1.txt', 'utf8');
            returnData = fileString;
            //console.log('Puzzle input', returnData);
            break;
        default:
            console.error('Data load failed')

            break;
    }
    return returnData;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<String> = new Array();
    const regex: RegExp = /\d+/gmus;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

class ChocolateMix {
    arrayOfRecipesScore: Array<string>;
    wokersActivePositionArray: Array<number>;
    noWorkers = 2;

    constructor(input) {
        this.arrayOfRecipesScore = input;
        this.wokersActivePositionArray = new Array;
        this.wokersActivePositionArray[0] = 0;
        this.wokersActivePositionArray[1] = 1;
    }

    bake() {

        let sum = 0;
        for (let i = 0; i < this.noWorkers; i++) {
            sum += +this.arrayOfRecipesScore[this.wokersActivePositionArray[i]]
        }
        let newNumbers: Array<string> = sum.toString().split('');
        newNumbers.forEach(char => {
            this.arrayOfRecipesScore.push(char);
        })
    }
    moveWorkers() {
        for (let i = 0; i < this.noWorkers; i++) {
            let currentPosition = +this.wokersActivePositionArray[i];
            let moveXSteps = +this.arrayOfRecipesScore[currentPosition] + 1;

            let newPosition = currentPosition + moveXSteps;
            newPosition = newPosition % this.arrayOfRecipesScore.length;
            this.wokersActivePositionArray[i] = newPosition;
        }
    }
}

function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let reqNumberOfRecipes = +input.shift() + 10;
    let chocolateMix = new ChocolateMix(input);

    let numberOfRecipes = 0;
    while (numberOfRecipes < reqNumberOfRecipes) {
        chocolateMix.bake();
        chocolateMix.moveWorkers();
        numberOfRecipes = chocolateMix.arrayOfRecipesScore.length;
    }

    let answer = +chocolateMix.arrayOfRecipesScore.slice(numberOfRecipes - 10).join('');

    return answer;
}

function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let searchString: string = input.shift().toString();
    let searchStringLength = searchString.length;
    let chocolateMix = new ChocolateMix(input);
    let found = false;
    let numberOfRecipes = 0;
    while (!found) {
        chocolateMix.bake();
        chocolateMix.moveWorkers();
        numberOfRecipes = chocolateMix.arrayOfRecipesScore.length;
        if (numberOfRecipes > searchStringLength) {
            let answer = chocolateMix.arrayOfRecipesScore.slice(numberOfRecipes - 7).join('');
            if (answer.includes(searchString)) {
                //Recipe found
                found = true;
                if (!answer.endsWith(searchString)) {
                    //it does not end with searchString, adjust accordingly
                    searchStringLength++;
                }
            }
        }
    }

    return numberOfRecipes - searchStringLength;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB');
    console.log('Puzzle part 2 solution is', resultPart2);


    function TestsForPart2() {
        let testCalc = partB('Part2Test1');
        if (testCalc == test2_ex1Result) {
            console.log('Puzzle part 2 example 1 passed');
        } else {
            console.log('Puzzle part 2 example 1 failed got', testCalc, 'expected', test2_ex1Result);
        }

        testCalc = partB('Part2Test2');
        if (testCalc == test2_ex2Result) {
            console.log('Puzzle part 2 example 2 passed');
        } else {
            console.log('Puzzle part 2 example 2 failed got', testCalc, 'expected', test2_ex2Result);
        }
        testCalc = partB('Part2Test3');
        if (testCalc == test2_ex3Result) {
            console.log('Puzzle part 2 example 3 passed');
        } else {
            console.log('Puzzle part 2 example 3 failed got', testCalc, 'expected', test2_ex3Result);
        }
    }

    function TestsForPart1() {
        let testCalc = partA('Test1');
        if (testCalc == test1_ex1Result) {
            console.log('Puzzle part 1 example 1 passed');
        } else {
            console.log('Puzzle part 1 example 1 failed got', testCalc, 'expected', test1_ex1Result);
        }

        // testCalc = partA('Test2');
        // if (testCalc == test1_ex2Result) {
        //     console.log('Puzzle part 1 example 2 passed');
        // } else {
        //     console.log('Puzzle part 1 example 2 failed got', testCalc, 'expected', test1_ex2Result);
        // }
        // testCalc = partA('Test3');
        // if (testCalc == test1_ex3Result) {
        //     console.log('Puzzle part 1 example 3 passed');
        // } else {
        //     console.log('Puzzle part 1 example 3 failed got', testCalc, 'expected', test1_ex3Result);
        // }

    }
}

main();
