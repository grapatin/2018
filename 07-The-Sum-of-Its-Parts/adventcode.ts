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
    let rawInput = inputData(typeofData).split('\n');
    let inputArray: Array<string> = new Array();

    rawInput.forEach(element => {
        inputArray.push(element[5] + element[36]);
    })

    return inputArray;
}


function partA(typeOfData: string) {
    let input = processInput(typeOfData);
    let output: string = '';

    //Array with all parts and their dependecies, sort parts
    //Take first part with 0 dep, and remove that part for other parts

    let allPartsMap: Map<string, string> = new Map();

    input.forEach(element => {
        let _part = element[1];
        let _dependOn = element[0];
        if (allPartsMap.has(_part)) {
            let _alreadyDependingOn = allPartsMap.get(_part);
            _alreadyDependingOn += _dependOn;
            allPartsMap.set(_part, _alreadyDependingOn);
        } else {
            allPartsMap.set(_part, _dependOn);
        }
        if (!allPartsMap.has(_dependOn)) {
            allPartsMap.set(_dependOn, '');
        }
    })

    let cont: boolean = true;
    while (cont) {
        let PartsArraywoDep: Array<string> = new Array();

        allPartsMap.forEach((value, key) => {
            if (value.length == 0) {
                PartsArraywoDep.push(key)
            }
        })
        if (PartsArraywoDep.length == 0) {
            //complete
            console.log('Done', output)
            cont = false;
        } else {
            PartsArraywoDep = PartsArraywoDep.sort();
            let currentPart = PartsArraywoDep[0];
            output += currentPart;
            //Remove value from Map and all dependecies
            allPartsMap.delete(currentPart);
            allPartsMap.forEach((depency, key) => {
                depency = depency.split(currentPart).join('');
                allPartsMap.set(key, depency);
            })
        }
    }
    return output;
}

function partB(typeOfData: string, noWorkers: number, offset: number) {
    let input = processInput(typeOfData);
    //Array with all parts and their dependecies, sort parts
    let allPartsMap: Map<string, string> = new Map();
    createPartsMap();

    //Create state machine for workers
    //They can be in 2 states
    //Idle or working, its idle when time is 0, working when time > 0 

    let workerArray: Array<number> = new Array(noWorkers).fill(0);
    let workerTaskArray: Array<string> = new Array(noWorkers).fill('');


    let cont: boolean = true;
    let time: number = 0;
    while (cont) {
        let PartsArraywoDep: Array<string> = new Array();

        findAllPartsReadyToMount(PartsArraywoDep);
        if (allPartsMap.size == 0 && (Math.max(...workerArray) == 0)) {
            //complete
            //console.log('We are done, result is', time);
            cont = false;
            return time;
        } else {
            PartsArraywoDep = PartsArraywoDep.sort();
            //go through all works and assign
            workerArray.forEach((workerTime, id) => {
                if (workerTime == 0) {
                    if (PartsArraywoDep.length > 0) {
                        let currentPart = PartsArraywoDep.shift();
                        //remove currentPart as in work...
                        allPartsMap.delete(currentPart);
                        workerArray[id] = currentPart.charCodeAt(0) + offset - 64;
                        workerTaskArray[id] = currentPart;
                    }
                }
            });
        }
        //let time pass 1 step
        time++;
        for (let i = 0; i < workerArray.length; i++) {
            if (workerArray[i] > 0) {
                workerArray[i]--;
                if (workerArray[i] == 0) {
                    //Remove value from Map and all dependecies 
                    removePartSinceItIsComplete(workerTaskArray[i]);
                    workerTaskArray[i] = '';
                }
            }
        }
    }

    return time;

    function removePartSinceItIsComplete(currentPart: string) {
        allPartsMap.forEach((depency, key) => {
            depency = depency.split(currentPart).join('');
            allPartsMap.set(key, depency);
        });
    }

    function findAllPartsReadyToMount(PartsArraywoDep: string[]) {
        allPartsMap.forEach((value, key) => {
            if (value.length == 0) {
                PartsArraywoDep.push(key);
            }
        });
    }

    function createPartsMap() {
        input.forEach(element => {
            let _part = element[1];
            let _dependOn = element[0];
            if (allPartsMap.has(_part)) {
                let _alreadyDependingOn = allPartsMap.get(_part);
                _alreadyDependingOn += _dependOn;
                allPartsMap.set(_part, _alreadyDependingOn);
            } else {
                allPartsMap.set(_part, _dependOn);
            }
            if (!allPartsMap.has(_dependOn)) {
                allPartsMap.set(_dependOn, '');
            }
        });
    }
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB', 5, 60);
    console.log('Puzzle part 2 solution is', resultPart2);


    function TestsForPart2() {
        let testCalc = partB('Part2Test1', 2, 0);
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
