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

    let sum2: number = 0;
    let sum3: number = 0;
    input.forEach(element => {
        let map = new Map();
        for (var char of element) {
            if (map.has(char)) {
                map.set(char, map.get(char) + 1);
            } else {
                map.set(char, 1);
            }
        }
        let onlyOncefor2: boolean = true;
        let onlyOncefor3: boolean = true;
        map.forEach(element => {
            if ((element == 2) && (onlyOncefor2)) {
                sum2++;
                onlyOncefor2 = false;
            }
            if ((element == 3) && (onlyOncefor3)) {
                sum3++;
                onlyOncefor3 = false;
            }
        });
    });
    console.log('Sum2:', sum2, 'Sum3:', sum3)
    return sum2 * sum3;
}

function partB(typeOfData: String) {
    let input = processInput(typeOfData);
    let stringFound: String = '';

    let indexA: number = 0, indexB: number = 0;
    for (const iteratorA of input) {
        for (const iteratorB of input) {
            if (indexA != indexB) {
                //compare the 2 strings, if they differ with more than 1 char abort
                let difference: number = 0, pos: number = 0, firstpos: number = 0;
                for (const char of iteratorA) {
                    if (char != iteratorB[pos]) {
                        difference++;
                        firstpos = pos;
                    }
                    if (difference > 1) {
                        break;
                    }
                    pos++;
                }
                if (difference == 1) {
                    stringFound = iteratorA + ' and ' + iteratorB;
                    console.log('Match found!:', stringFound, 'differs at', pos);
                    stringFound = iteratorA.substr(0, firstpos) + iteratorA.substr(firstpos + 1);
                    console.log('Removed offending char', stringFound);
                    break;
                }
            }
            indexB++;
        }
        indexA++;
        indexB = 0;
        if (stringFound != '') {
            break;
        }
    }
    return stringFound;
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
