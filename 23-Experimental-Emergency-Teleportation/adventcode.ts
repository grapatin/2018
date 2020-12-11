import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

function inputData(typeOfData: string) {
    let returnData: string;
    //load data    
    if (typeOfData.startsWith('T1_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle1_ex[+num];
    }
    if (typeOfData.startsWith('T2_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle2_ex[+num];
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

    let inputArray: Array<number> = new Array();
    const regex: RegExp = /-?\d+/gm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(+element);
    })

    return inputArray;
}

class Cord {
    x: number
    y: number
    z: number
    radius: number
    constructor(x, y, z, radius) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius
    }
}


function partA(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);

    let cordArray: Array<Cord> = new Array;
    for (let i = 0; i < input.length; i = i + 4) {
        let cord = new Cord(input[i], input[i + 1], input[i + 2], input[i + 3]);
        cordArray.push(cord);
    }
    //Find cord with biggest radius
    let longestRadius = 0;
    let shortestRadius = Number.MAX_SAFE_INTEGER;
    let origio: Cord;
    cordArray.forEach(cord => {
        if (cord.radius > longestRadius) {
            longestRadius = cord.radius;
            origio = cord;
        }
        if (cord.radius < shortestRadius) {
            shortestRadius = cord.radius
        }
    });
    console.log('Longest radius is', longestRadius);
    console.log('Shortest radius is', shortestRadius);
    let count = 0;

    cordArray.forEach(cord => {
        let distance: number;
        let xdist = Math.abs(cord.x - origio.x); //example -2 och -5 borde bli 3;  2 och -6 borde bli 8; -3 och 9 borde bli 12
        let ydist = Math.abs(cord.y - origio.y);
        let zdist = Math.abs(cord.z - origio.z);
        distance = xdist + ydist + zdist;

        if (distance <= longestRadius) {
            count++;
        }
    });

    return count;
}

function partB(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);
    let maxX, maxY, maxZ, minX, minY, minZ;

    maxX = maxY = maxZ = Number.MIN_SAFE_INTEGER;
    minX = minY = minZ = Number.MAX_SAFE_INTEGER;

    let cordArray: Array<Cord> = new Array;
    for (let i = 0; i < input.length; i = i + 4) {
        let cord = new Cord(input[i], input[i + 1], input[i + 2], input[i + 3]);
        if (cord.x > maxX) {
            maxX = cord.x;
        }
        if (cord.y > maxY) {
            maxY = cord.y;
        }
        if (cord.z > maxZ) {
            maxZ = cord.z;
        }
        if (cord.x < minX) {
            minX = cord.x;
        }
        if (cord.y < minY) {
            minY = cord.y;
        }
        if (cord.z < minZ) {
            minZ = cord.z;
        }
        cordArray.push(cord);
    }

    //Go through all positions from minZ to maxZ, minY to maxZ, minX to maxX
    let count;
    let bestCord: Cord;
    let maxCount = 0;
    const size = 1000660;

    for (let z = minZ; z < maxZ + 1; z = z + size) {
        for (let y = minY; y < maxY + 1; y = y + size) {
            for (let x = minX; x < maxX + 1; x = x + size) {
                count = 0;
                cordArray.forEach(cord => {
                    let xdist = Math.abs(cord.x - x); //example -2 och -5 borde bli 3;  2 och -6 borde bli 8; -3 och 9 borde bli 12
                    let ydist = Math.abs(cord.y - y);
                    let zdist = Math.abs(cord.z - z);
                    let distance = xdist + ydist + zdist;
                    if (distance <= cord.radius) {
                        count++;
                    }
                });
                if (count > maxCount) {
                    maxCount = count;
                    bestCord = new Cord(x, y, z, 0)
                }
            }
        }
    }

    let xdist = Math.abs(0 - bestCord.x); //example -2 och -5 borde bli 3;  2 och -6 borde bli 8; -3 och 9 borde bli 12
    let ydist = Math.abs(0 - bestCord.y);
    let zdist = Math.abs(0 - bestCord.z);
    let distance = xdist + ydist + zdist;
    console.log('Preliminary distance is', distance);

    for (let z = bestCord.z - size; z < bestCord.z + size; z++) {
        for (let y = bestCord.y - size; y < bestCord.y + size; y++) {
            for (let x = bestCord.x - size; x < bestCord.x + size; x++) {
                count = 0;
                cordArray.forEach(cord => {
                    let xdist = Math.abs(cord.x - x); //example -2 och -5 borde bli 3;  2 och -6 borde bli 8; -3 och 9 borde bli 12
                    let ydist = Math.abs(cord.y - y);
                    let zdist = Math.abs(cord.z - z);
                    let distance = xdist + ydist + zdist;
                    if (distance <= cord.radius) {
                        count++;
                    }
                });
                if (count > maxCount) {
                    maxCount = count;
                    bestCord = new Cord(x, y, z, 0)
                }
            }
        }
    }

    xdist = Math.abs(0 - bestCord.x); //example -2 och -5 borde bli 3;  2 och -6 borde bli 8; -3 och 9 borde bli 12
    ydist = Math.abs(0 - bestCord.y);
    zdist = Math.abs(0 - bestCord.z);
    distance = xdist + ydist + zdist;

    console.log('distance is', distance);

    return distance;
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
