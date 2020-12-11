import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
const readFile = util.promisify(fs.readFile);


function inputData(typeOfData: String) {
    let returnData: String;
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

function processInput(typeofData: String) {
    let rawInput = inputData(typeofData);
    let inputArray = rawInput.split('\n');

    return inputArray;
}


function partA(typeOfData: String) {
    let input = processInput(typeOfData);
    let n = 1000;
    let playArea: number[][] = new Array(n)
        .fill(0)
        .map(() => new Array(n)
            .fill(0));

    input.forEach(element => {
        //Find starting pos from #1 @ 1,3: 4x4
        let sheets = element.split('@').join(':').split(':');
        sheets.forEach((element, index) => {
            sheets[index] = element.trim();
        });

        //Second array element is now starting pos
        let santaHelper: number = +sheets[0].split('#')[1];
        let startingPos = sheets[1].split(',');
        let squareSize = sheets[2].split('x');
        const yStart: number = +startingPos[0];
        const xStart: number = +startingPos[1];
        //Find square and mark in Array set X if overlap
        for (let yVal = 0; yVal < +squareSize[0]; yVal++) {
            for (let xVal = 0; xVal < +squareSize[1]; xVal++) {
                if (playArea[yStart + yVal][xStart + xVal] == 0) {
                    playArea[yStart + yVal][xStart + xVal] = santaHelper;
                }
                else {
                    playArea[yStart + yVal][xStart + xVal] = -1;
                }
            }
        }
    });

    //Now count number of -1
    let counter: number = 0;
    playArea.forEach(element => {
        element.forEach(square => {
            if (square == -1) {
                counter++;
            }
        });
    });

    return counter;
}

function partB(typeOfData: String) {
    let input = processInput(typeOfData);
    let n = 1000;
    let map = new Map();
    let playArea: number[][] = new Array(n)
        .fill(0)
        .map(() => new Array(n)
            .fill(0));

    input.forEach(element => {
        //Find starting pos from #1 @ 1,3: 4x4
        let sheets = element.split('@').join(':').split(':');
        sheets.forEach((element, index) => {
            sheets[index] = element.trim();
        });

        //Second array element is now starting pos
        let santaHelper: number = +sheets[0].split('#')[1];
        let startingPos = sheets[1].split(',');
        let squareSize = sheets[2].split('x');
        const yStart: number = +startingPos[0];
        const xStart: number = +startingPos[1];
        map.set(santaHelper, santaHelper);

        //Find square and mark in Array set X if overlap
        for (let yVal = 0; yVal < +squareSize[0]; yVal++) {
            for (let xVal = 0; xVal < +squareSize[1]; xVal++) {
                if (playArea[yStart + yVal][xStart + xVal] == 0) {
                    playArea[yStart + yVal][xStart + xVal] = santaHelper;
                }
                else {
                    map.delete(santaHelper);
                    map.delete(playArea[yStart + yVal][xStart + xVal])
                    playArea[yStart + yVal][xStart + xVal] = -1;
                }
            }
        }
    });
    let valueToReturn: number = 0;
    map.forEach(value => {
        valueToReturn = +value;
    });
    return valueToReturn;
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
