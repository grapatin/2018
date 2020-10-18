import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
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
    let inputArray = rawInput;

    return inputArray;
}


function partA(typeOfData: string) {
    let input: String = new String(processInput(typeOfData));
    let output: String = '';
    let continueV: boolean = true;
    //go through string and remove aA etc until no more hits are found

    while (continueV) {
        let OriginalLength = input.length;
        for (let index = 0; index < input.length - 1; index++) {
            const diff: number = Math.abs(input.charCodeAt(index) - input.charCodeAt(index + 1))
            if (diff == 32) {
                //diff 32 means that we have a Aa or bB combo
                //remove chars
                input = input.replace(input.charAt(index) + input.charAt(index + 1), '');
            }
        }
        if (OriginalLength == input.length) {
            //No change was detected lets break out
            continueV = false;
            output = input;
        }
    }

    return output.length;
}

function partB(typeOfData: string) {
    let input: String;
    let sourceInput: String = new String(processInput(typeOfData));
    //go through string and remove aA etc until no more hits are found
    const alfaS: String = 'abcdefghijklmnopqrstuvwxyz';
    const alfaL: String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let iPos = 0;
    let minLeft: number = 50000; //Input string is 50 000

    for (const key in alfaS) {
        input = sourceInput.slice();
        input = input.split(alfaS[iPos]).join('');
        input = input.split(alfaL[iPos]).join('');
        let output: String = '';
        let continueV: boolean = true;

        while (continueV) {
            let OriginalLength = input.length;
            for (let index = 0; index < input.length - 1; index++) {
                const diff: number = Math.abs(input.charCodeAt(index) - input.charCodeAt(index + 1))
                if (diff == 32) {
                    //diff 32 means that we have a Aa or bB combo
                    //remove chars
                    input = input.replace(input.charAt(index) + input.charAt(index + 1), '');
                }
            }
            if (OriginalLength == input.length) {
                //No change was detected lets break out
                continueV = false;
                output = input;
            }
        }
        //Compare and store the best one
        if (output.length < minLeft) {
            minLeft = output.length
        }
        iPos++;
    }
    return minLeft;
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
