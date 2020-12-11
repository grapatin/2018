import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { start } from "repl";
const readFile = util.promisify(fs.readFile);
const size = 300;

class FuelCell {
    x: number;
    y: number;
    rackId: number;
    powerLevel: number;
    currentSquareSize = 0;
    currentSquareFuel = 0;
    private _powerLevel_part1: number;


    get3rdDigit() {
        let _3rdNumber: number;
        const regEx = /\d\d\d$/; //get the last 3 digits
        let _s = this._powerLevel_part1.toString();
        let match1 = _s.match(regEx);

        if (match1 != null) {
            const regEx2 = /\d/;
            let match2 = match1[0].match(regEx2);
            _3rdNumber = +match2;
        } else {
            _3rdNumber = 0;
        }
        return _3rdNumber;
    }

    constructor(x: number, y: number, serialnumber: number) {
        this.x = x;
        this.y = y;
        this.rackId = this.x + 10;
        this._powerLevel_part1 = ((this.rackId * this.y) + serialnumber) * this.rackId;
        let _3rdNumber = this.get3rdDigit()
        this.powerLevel = _3rdNumber - 5;
    }


}


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
    const regex: RegExp = /[-]?\d+/g;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

function partA(typeOfData: string): string {
    let input: Array<String> = processInput(typeOfData);

    let gridSerial: number = +input[0];
    const startAtOne = 1;
    let fuelCellMap = new Map;
    let maxFuel = 0;
    let maxSquareSize = 0;
    let cordX = 0, cordY = 0;

    for (let y = startAtOne; y < size + startAtOne; y++) {
        for (let x = startAtOne; x < size + startAtOne; x++) {
            let fuelCell = new FuelCell(x, y, gridSerial);
            fuelCellMap.set(x + ',' + y, fuelCell);
        }
    }


    for (let sizeOfSqare = 1; sizeOfSqare < size + 1; sizeOfSqare++) {
        fuelCellMap.forEach(fc => {
            let sum = fc.currentSquareFuel;
            const fitInsideAllowedArea = ((fc.x + sizeOfSqare) < size + 1) && ((fc.y + sizeOfSqare) < size + 1);
            if (fitInsideAllowedArea) {
                for (let x = fc.x; x < (fc.x + sizeOfSqare); x++) {
                    let y = fc.y + fc.currentSquareSize;
                    let newX = x;
                    let newY = y;
                    let getCorrectFuelCell = (newX + ',' + newY);
                    let _fc: FuelCell = fuelCellMap.get(getCorrectFuelCell);
                    sum += _fc.powerLevel;
                }
                for (let y = fc.y; y < fc.y + sizeOfSqare - 1; y++) {
                    let x = fc.x + fc.currentSquareSize;
                    let newX = x;
                    let newY = y;
                    let getCorrectFuelCell = (newX + ',' + newY);
                    let _fc: FuelCell = fuelCellMap.get(getCorrectFuelCell);
                    sum += _fc.powerLevel;
                }

                fc.currentSquareSize++;
                fc.currentSquareFuel = sum;

                if (sum > maxFuel) {
                    maxFuel = sum;
                    maxSquareSize = sizeOfSqare;
                    cordX = fc.x;
                    cordY = fc.y;
                }
            }
        })
    }


    let _str: string = cordX + ',' + cordY + ',' + maxSquareSize;

    return _str
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

        testCalc = partA('Test2');
        if (testCalc == test1_ex2Result) {
            console.log('Puzzle part 1 example 2 passed');
        } else {
            console.log('Puzzle part 1 example 2 failed got', testCalc, 'expected', test1_ex2Result);
        }
        // testCalc = partA('Test3');
        // if (testCalc == test1_ex3Result) {
        //     console.log('Puzzle part 1 example 3 passed');
        // } else {
        //     console.log('Puzzle part 1 example 3 failed got', testCalc, 'expected', test1_ex3Result);
        // }

    }
}

main();
