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
    let guard: number = 0;
    let guardSleepingMap = new Map();
    let fallASleep = -1;
    //Sort arrays
    input.sort();

    input.forEach(element => {
        if (element.includes('#')) {
            //this is a guard entry
            let findGuard_ = element.split('#');
            let findGuard = findGuard_[1].split(' ');
            guard = +findGuard[0];
            fallASleep = 0;
        }
        if (element.includes('falls asleep')) {
            let findTime_ = element.split('] falls ');
            let findTime = findTime_[0].split(':');
            fallASleep = +findTime[1];
        }
        if (element.includes('] wakes up')) {
            let findTime_ = element.split('] wakes up');
            let findTime = findTime_[0].split(':');
            let wakeUpTime = +findTime[1]

            if (guardSleepingMap.has(guard)) {
                let timeSleptA = guardSleepingMap.get(guard);
                for (let i = fallASleep; i < wakeUpTime; i++) {
                    timeSleptA[i]++;
                }
                guardSleepingMap.set(guard, timeSleptA);
            } else {
                let timeSleptA = new Array(60).fill(0);
                for (let i = fallASleep; i < wakeUpTime; i++) {
                    timeSleptA[i]++;
                }
                guardSleepingMap.set(guard, timeSleptA);
            }
        }
    });

    //Find guard that sleept the most
    let maxSleeptFound = 0;
    let sleepingGuard = 0;
    guardSleepingMap.forEach((sleepTimeA, guard) => {
        let guardSleepTime: number = 0;
        sleepTimeA.forEach(element => {
            guardSleepTime += element;
        });
        if (guardSleepTime > maxSleeptFound) {
            maxSleeptFound = guardSleepTime;
            sleepingGuard = guard
        }
    });
    let mostSleepyGuardArray = guardSleepingMap.get(sleepingGuard);

    let maxFound: number = 0;
    let maxAtIndex: number = 0;

    for (let index = 0; index < mostSleepyGuardArray.length; index++) {
        const element = mostSleepyGuardArray[index];

        if (element > maxFound) {
            maxFound = element;
            maxAtIndex = index;
        }
    }

    return sleepingGuard * maxAtIndex;
}

function partB(typeOfData: String) {
    let input = processInput(typeOfData);
    let guard: number = 0;
    let guardSleepingMap = new Map();
    let fallASleep = -1;
    //Sort arrays
    input.sort();

    input.forEach(element => {
        if (element.includes('#')) {
            //this is a guard entry
            let findGuard_ = element.split('#');
            let findGuard = findGuard_[1].split(' ');
            guard = +findGuard[0];
            fallASleep = 0;
        }
        if (element.includes('falls asleep')) {
            let findTime_ = element.split('] falls ');
            let findTime = findTime_[0].split(':');
            fallASleep = +findTime[1];
        }
        if (element.includes('] wakes up')) {
            let findTime_ = element.split('] wakes up');
            let findTime = findTime_[0].split(':');
            let wakeUpTime = +findTime[1]

            if (guardSleepingMap.has(guard)) {
                let timeSleptA = guardSleepingMap.get(guard);
                for (let i = fallASleep; i < wakeUpTime; i++) {
                    timeSleptA[i]++;
                }
                guardSleepingMap.set(guard, timeSleptA);
            } else {
                let timeSleptA = new Array(60).fill(0);
                for (let i = fallASleep; i < wakeUpTime; i++) {
                    timeSleptA[i]++;
                }
                guardSleepingMap.set(guard, timeSleptA);
            }
        }
    });

    //Find guard that sleept the most at a specific minute
    let maxSleeptFound = 0;
    let sleepingGuard = 0;
    let maxAtIndex = 0;
    guardSleepingMap.forEach((sleepTimeA, guard) => {
        sleepTimeA.forEach((element, index) => {
            if (element > maxSleeptFound) {
                maxSleeptFound = element;
                sleepingGuard = guard;
                maxAtIndex = index;
            }
        });
    });

    return sleepingGuard * maxAtIndex;
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
