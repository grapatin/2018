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
    let inputArray = rawInput;

    return inputArray;
}


function partA(typeOfData: string) {
    let input = processInput(typeOfData);
    let maxSize: number = 0;
    interface Coordinate {
        destinationName: string,
        distance?: number,
        equalDist?: boolean,
    }

    interface destination {
        x: number,
        y: number,
        infinite: boolean,
        count: number
    }

    //Create a coordinate field, find maxX and maxY
    let { maxX, maxY, mapDestion }: { maxX: number; maxY: number; mapDestion: Map<string, destination>; } = FindMaxandCreateMap();
    //console.log('MaxX', maxX, 'MaxY', maxY, 'Map', mapDestion);

    let cordSystem: Coordinate[][] = InitializeCordSystem();

    mapDestion.forEach((dest: destination, key: string) => {
        //Calculate the distance for each cordinate to this point
        //if shortest write it
        //if tie mark it as tie

        for (let iX = 0; iX < cordSystem.length; iX++) {
            for (let iY = 0; iY < cordSystem[iX].length; iY++) {
                const distance = Math.abs(iX - dest.x) + Math.abs(iY - dest.y);
                let cord = cordSystem[iX][iY];
                const Shorter = cord.distance > distance;
                const sameDistance = cord.distance == distance;
                const NewCordinate = cord.destinationName == 'notset';
                if (NewCordinate) {
                    cord.destinationName = key;
                    cord.distance = distance;
                    cord.equalDist = false;
                } else if (sameDistance) {
                    cord.equalDist = true;
                } else if (Shorter) {
                    cord.distance = distance;
                    cord.destinationName = key
                    cord.equalDist = false;
                }
            }
        }
    });
    //Remove those that are infinite, its those on X= 0, x= max, y=0, y= max
    for (let iX = 0; iX < cordSystem.length; iX++) {
        for (let iY = 0; iY < cordSystem[iX].length; iY++) {
            let cord = cordSystem[iX][iY];
            let dest = mapDestion.get(cord.destinationName);
            if (cord.equalDist == false) {
                dest.count++;
                if ((iX == 0) || (iY == 0) || (iX == (maxX - 1)) || (iY == (maxY - 1))) {
                    dest.infinite = true;
                }
                mapDestion.set(cord.destinationName, dest);
            }
        }
    }

    let maxCord: string;
    mapDestion.forEach((element, key) => {
        if (element.infinite == false) {
            if (element.count > maxSize) {
                maxSize = element.count;
                maxCord = key;
            }
        }
    })
    //console.log('Most element found on dest', maxCord, 'With size', maxSize);
    return maxSize;

    function InitializeCordSystem() {
        let cordSystem: Coordinate[][] = Array
            .from({ length: maxX }, () => ({ destinationName: 'notset', distance: 0, equalDist: false }))
            .map(() => Array
                .from({ length: maxY }, () => ({ destinationName: 'notset', distance: 0, equalDist: false })));
        return cordSystem;
    }

    function FindMaxandCreateMap() {
        let maxX: number = 0;
        let maxY: number = 0;
        let mapDestion = new Map();
        input.forEach(element => {
            let xyArray = element.split(',');
            let dest_: destination = { x: +xyArray[0], y: +xyArray[1], infinite: false, count: 0 };
            mapDestion.set(element, dest_);
            if (+xyArray[0] > maxX) {
                maxX = +xyArray[0];
            }
            if (+xyArray[1] > maxY) {
                maxY = +xyArray[1];
            }
            //Add one extra for safety
            maxX++;
            maxY++;
        });
        return { maxX, maxY, mapDestion };
    }
}

function partB(typeOfData: string, lessDist: number) {
    let input = processInput(typeOfData);
    let areaWithin: number = 0;
    interface Coordinate {
        destinationName: string,
        distance?: number,
        equalDist?: boolean,
    }

    interface destination {
        x: number,
        y: number,
        infinite: boolean,
        count: number
    }

    //Create a coordinate field, find maxX and maxY
    let { maxX, maxY, mapDestion }: { maxX: number; maxY: number; mapDestion: Map<string, destination>; } = FindMaxandCreateMap();
    //console.log('MaxX', maxX, 'MaxY', maxY, 'Map', mapDestion);

    let cordSystem: Coordinate[][] = InitializeCordSystem();

    for (let iX = 0; iX < cordSystem.length; iX++) {
        for (let iY = 0; iY < cordSystem[iX].length; iY++) {
            let cord = cordSystem[iX][iY];
            let distance = 0;
            //Calculate distance to all possible destinationCords
            mapDestion.forEach(element => {
                distance += Math.abs(iX - element.x) + Math.abs(iY - element.y)
            })
            cord.distance = distance;

            if (distance < lessDist) {
                areaWithin++;
            }
        }
    }



    return areaWithin;

    function InitializeCordSystem() {
        let cordSystem: Coordinate[][] = Array
            .from({ length: maxX }, () => ({ destinationName: 'notset', distance: 0, equalDist: false }))
            .map(() => Array
                .from({ length: maxY }, () => ({ destinationName: 'notset', distance: 0, equalDist: false })));
        return cordSystem;
    }

    function FindMaxandCreateMap() {
        let maxX: number = 0;
        let maxY: number = 0;
        let mapDestion = new Map();
        input.forEach(element => {
            let xyArray = element.split(',');
            let dest_: destination = { x: +xyArray[0], y: +xyArray[1], infinite: false, count: 0 };
            mapDestion.set(element, dest_);
            if (+xyArray[0] > maxX) {
                maxX = +xyArray[0];
            }
            if (+xyArray[1] > maxY) {
                maxY = +xyArray[1];
            }
            //Add one extra for safety
            maxX++;
            maxY++;
        });
        return { maxX, maxY, mapDestion };
    }
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
    console.log('Puzzle part 1 solution is', resultPart1);

    TestsForPart2();
    let resultPart2 = partB('PartB', 10000);
    console.log('Puzzle part 2 solution is', resultPart2);


    function TestsForPart2() {
        let testCalc = partB('Part2Test1', 32);
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
