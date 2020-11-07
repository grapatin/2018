import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
const readFile = util.promisify(fs.readFile);

const size = 1000;


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

class Plant {
    plantId: number;
    hasAPlant: number;
    constructor(plantId: number = 0, hasAPlant: number = 0) {
        this.plantId = plantId;
        this.hasAPlant = hasAPlant;
    }
}

class PlantProcessing {
    breedPatterns: Array<number>
    plantArray: Array<string>
    plantMap: Map<number, Plant> = new Map;

    constructor(breedInput: Array<String>, plantArray) {
        this.breedPatterns = new Array(32).fill(0);
        for (let i = 0; i < breedInput.length; i += 2) {
            let pattern = breedInput[i];
            let breed = +breedInput[i + 1].split('#').join('1').split('.').join('0');
            let binaryPattern = parseInt(pattern.split('#').join('1').split('.').join('0'), 2);
            //console.log('Binary Pattern:', binaryPattern);
            this.breedPatterns[binaryPattern] = breed;
        }
        plantArray.forEach((element, index) => {
            let plant: Plant = new Plant();
            plant.hasAPlant = element;
            plant.plantId = index;
            if (plant.hasAPlant == 1) {
                this.plantMap.set(plant.plantId, plant);
            }
        });
    }

    chechforPlant(index: number): number {
        if (this.plantMap.has(index)) {
            return +this.plantMap.get(index).hasAPlant;
        } else {
            return 0;
        }
    }

    growOneGeneration() {
        let newPlantMap: Map<number, Plant> = new Map;
        let firstValue: number;
        let lastValue: number;

        let keyArray: Array<number> = [...this.plantMap.keys()];
        let sortedKeyArray = keyArray.sort((a, b) => a - b);
        firstValue = sortedKeyArray[0];
        lastValue = sortedKeyArray[sortedKeyArray.length - 1];

        for (let i = firstValue - 2; i < lastValue + 2; i++) {
            let bit_0: number;
            let bit_1: number;
            let bit_2: number;
            let bit_3: number;
            let bit_4: number;

            bit_0 = this.chechforPlant(i + 2);
            bit_1 = this.chechforPlant(i + 1);
            bit_2 = this.chechforPlant(i);
            bit_3 = this.chechforPlant(i - 1);
            bit_4 = this.chechforPlant(i - 2);

            let pattern = bit_0 + bit_1 * 2 + bit_2 * 4 + bit_3 * 8 + bit_4 * 16;
            let isItAnewPlant = this.breedPatterns[pattern];

            if (isItAnewPlant) {
                let _plant = new Plant;
                _plant.plantId = i;
                _plant.hasAPlant = isItAnewPlant;
                newPlantMap.set(i, _plant)
            }
        }

        this.plantMap = newPlantMap;
    }
    calculateScore(): number {
        let sum = 0;

        this.plantMap.forEach(plant => {
            sum += plant.plantId;
        })
        return sum;
    }

    consoleLogPlants() {
        let keyArray: Array<number> = [...this.plantMap.keys()];
        let sortedKeyArray = keyArray.sort((a, b) => a - b);
        let firstValue = sortedKeyArray[0];
        let lastValue = sortedKeyArray[sortedKeyArray.length - 1];
        let outPutString: string = '';

        for (let i = firstValue; i < lastValue; i++) {
            outPutString += this.chechforPlant(i);
        }
        console.log('Current Plants:', outPutString);
    }
}



function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let plantArray = input.shift().split('#').join('1').split('.').join('0').split('');


    let plantProcessing = new PlantProcessing(input, plantArray);
    for (let i = 0; i < 20; i++) {
        plantProcessing.growOneGeneration();
        plantProcessing.consoleLogPlants();
    }

    let score = plantProcessing.calculateScore()

    return score;
}

function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let plantArray = input.shift().split('#').join('1').split('.').join('0').split('');
    let score: number;

    let plantProcessing = new PlantProcessing(input, plantArray);
    for (let i = 0; i < 1000; i++) {
        plantProcessing.growOneGeneration();
        //plantProcessing.consoleLogPlants();
        score = plantProcessing.calculateScore()
        console.log('At ', i, 'days score is:', score);
    }

    score = score + 80 * (50000000000 - 1000)

    return score;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
    console.log('Puzzle part 1 solution is', resultPart1);

    //TestsForPart2();
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
