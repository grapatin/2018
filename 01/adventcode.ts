import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
const readFile = util.promisify(fs.readFile);


function inputData(typeOfData: String) {
    let returnData : String;
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
            //Convert format so that it matches example files
            returnData = fileString.split('\n').join(',');
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
    let inputArray = rawInput.split(',');

    return inputArray;
}


function partA(typeOfData: String) {
    let input = processInput(typeOfData);

    let sum :number = 0;
    input.forEach(element => {
        let y:number =+element;
        sum+=+y;
    });
    return sum;
}


function partB(typeOfData: String) {
    let input = processInput(typeOfData);
    let sum :number = 0;
    let map = new Map();
    map.set(0,1); //Set the starting freq
    let cont = true;

    while (cont) {
        for (const element of input) {
            let y:number =+element;
            sum+=y;
            if (map.has(sum)) {
                cont = false;
                break;
            } else {
                map.set(sum,1);
            }   
        }
    }

    return sum;
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
        testCalc = partA('Test2');
        if (testCalc == test1_ex2Result) {
            console.log('Puzzle part 1 example 2 passed');
        } else {
            console.log('Puzzle part 1 example 2 failed got', testCalc, 'expected', test1_ex2Result);
        }
        testCalc = partA('Test3');
        if (testCalc == test1_ex3Result) {
            console.log('Puzzle part 1 example 3 passed');
        } else {
            console.log('Puzzle part 1 example 3 failed got', testCalc, 'expected', test1_ex3Result);
        }
        return testCalc;
    }
}

main();
