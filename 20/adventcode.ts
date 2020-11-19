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

    let inputArray: Array<String> = new Array();
    const regex: RegExp = /(-?[0-9]+[,]\s+-?[0-9]+)/gmus;

    return rawInput;
}

interface recReturnValues {
    _longestLength: number;
    _index: number;
}

//calc the longest string between all | before next ( or )
function recCalcLongestPath(regString: string): recReturnValues {
    let length = 0;
    let longest = 0;

    let regArray = regString.split('');

    for (let i = 0; i < regArray.length; i++) {
        let char = regArray[i];
        switch (char) {
            case 'N':
            case 'S':
            case 'E':
            case 'W':
                length++;
                break;
            case ')':
            case '$':
                if (length > longest) {
                    longest = length;
                } else if (length == 0) {
                    //This was a side track
                    longest = 0;
                }

                return {
                    _longestLength: longest,
                    _index: i
                }

                break;
            case '|':
                if (length > longest) {
                    longest = length;
                }
                length = 0;
                break;
            case '(':
                let _recReturnValue = recCalcLongestPath(regString.slice(++i));
                length += _recReturnValue._longestLength;
                i += _recReturnValue._index;
                break;
            default:
                throw 'Unexpected value in regEx';
                break;
        }
    }
}

function partA(typeOfData: string): number {
    let input: string = processInput(typeOfData);
    //remove start char
    let recValues: recReturnValues = recCalcLongestPath(input.slice(1));

    return recValues._longestLength;
}

function partB(typeOfData: string): number {
    let input: string = processInput(typeOfData);

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
