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
    const regex: RegExp = /[#.]+/mg;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

class PlantProcessing {
    breedPatterns: Array<number>
    plantArray: Array<string>
    constructor(breedInput: Array<String>, plantArray: Array<string>) {
        this.breedPatterns = new Array(32).fill(0);
        for (let i = 0; i < breedInput.length; i += 2) {
            let pattern = breedInput[i];
            let breed = +breedInput[i + 1].split('#').join('1').split('.').join('0');
            let binaryPattern = parseInt(pattern.split('#').join('1').split('.').join('0'), 2);
            //console.log('Binary Pattern:', binaryPattern);
            this.breedPatterns[binaryPattern] = breed;
        }
        this.plantArray = plantArray;
    }
    growOneGeneration() {
        //copy existing array into new array
        let orgArray = this.plantArray.slice();
        //take the first 5 values of orgArray, check against breedPattern and update this.plantArray.slice

        for (let i = 2; i < orgArray.length - 2; i++) {
            let pattern = parseInt(orgArray[i - 2] + orgArray[i - 1] + orgArray[i] + orgArray[i + 1] + orgArray[i + 2], 2);
            this.plantArray[i] = this.breedPatterns[pattern].toString();
        }
    }
    calculateScore(): number {
        let score = -40;
        let sum = 0;
        for (let i = 0; i < this.plantArray.length; i++) {
            sum += +this.plantArray[i] * score;
            score++;
        }
        return sum;
    }
}



function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let plantArray = input.shift().split('#').join('1').split('.').join('0').split('');
    add40EmptyStartandStopPots();


    let plantProcessing = new PlantProcessing(input, plantArray);
    console.log('result', plantProcessing.plantArray.join(''));
    for (let i = 0; i < 20; i++) {
        plantProcessing.growOneGeneration();
        console.log('result', plantProcessing.plantArray.join(''));
    }

    console.log('result', plantProcessing.plantArray.join(''));
    let score = plantProcessing.calculateScore()

    return score;

    function add40EmptyStartandStopPots() {
        for (let i = 0; i < 40; i++) {
            plantArray.unshift('0');
            plantArray.push('0');
        }
    }
}

function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);

    return 0;
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
        /*
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
        }*/
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
