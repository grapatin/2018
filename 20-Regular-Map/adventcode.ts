import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { createSecureContext } from "tls";
import { start } from "repl";
import { OutgoingMessage } from "http";
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

enum door {
    door,
    wall,
    unkown
}

class Room {
    North: Room
    South: Room
    West: Room
    East: Room
    distance: number
    xyCords: string
    constructor(comingFromDirection, comingFromRoom, distance) {
        this.distance = distance;
        switch (comingFromDirection) {
            case 'North':
                this.North = comingFromRoom;
                break;
            case 'South':
                this.South = comingFromRoom;
                break;
            case 'West':
                this.West = comingFromRoom;
                break;
            case 'East':
                this.East = comingFromRoom;
                break;
            default:
                //First room
                break;
        }
    }
    getCord() {
        const regex = /-?\d+/gm;
        let xyArray = this.xyCords.match(regex)
        return {
            x: +xyArray[0],
            y: +xyArray[1]
        }
    }
    setCord(x: number, y: number) {
        let currentCord = 'x=' + x + ';y=' + y;
        this.xyCords = currentCord;;
        return currentCord;
    }
    static convertCords(x: number, y: number) {
        let returnString = 'x=' + x + ';y=' + y;
        return returnString;
    }
}

function createCastle(room: Room, stringPos: number) {
    let distance = room.distance;
    let orgDistance = distance;
    let orgRoom = room;
    let longestDistance = distance;

    let xyCords = room.getCord();
    let currentX: number = xyCords.x;
    let currentY: number = xyCords.y;
    let cont = true;

    while (cont) {
        let char = globalString[stringPos];
        stringPos++;
        switch (char) {
            case 'N':
                distance++;
                currentY -= 2;
                //only create room if room does not exist
                if (!roomMap.has(Room.convertCords(currentX, currentY))) {
                    room = new Room('South', room, distance);
                    room.setCord(currentX, currentY);
                    roomMap.set(Room.convertCords(currentX, currentY), room);
                } else {
                    let nextRoom = roomMap.get(Room.convertCords(currentX, currentY));
                    nextRoom.South = room;
                    room = nextRoom;
                }
                break;
            case 'S':
                distance++;
                currentY += 2;
                if (!roomMap.has(Room.convertCords(currentX, currentY))) {
                    room = new Room('North', room, distance);
                    room.setCord(currentX, currentY);
                    roomMap.set(Room.convertCords(currentX, currentY), room);
                } else {
                    let nextRoom = roomMap.get(Room.convertCords(currentX, currentY));
                    nextRoom.North = room;
                    room = nextRoom;
                }
                break;
            case 'E':
                distance++;
                currentX += 2;
                if (!roomMap.has(Room.convertCords(currentX, currentY))) {
                    room = new Room('West', room, distance);
                    room.setCord(currentX, currentY);
                    roomMap.set(room.xyCords, room);
                } else {
                    let nextRoom = roomMap.get(Room.convertCords(currentX, currentY));
                    nextRoom.West = room;
                    room = nextRoom;
                }
                break;
            case 'W':
                distance++;
                currentX -= 2;
                if (!roomMap.has(Room.convertCords(currentX, currentY))) {
                    room = new Room('East', room, distance);
                    room.setCord(currentX, currentY);
                    roomMap.set(Room.convertCords(currentX, currentY), room);
                } else {
                    let nextRoom = roomMap.get(Room.convertCords(currentX, currentY));
                    nextRoom.East = room;
                    room = nextRoom;
                }
                break;
            case ')':
            case '$':
                //End of subgroup return stringPos to continue from
                //check if shortest path has same length as orgDistance
                if (distance > longestDistance) {
                    longestDistance = distance;
                } else if (distance == orgDistance) {
                    longestDistance = orgDistance;
                }
                return { stringPos, longestDistance }
                break;
            case '|':
                //Revert back to original room
                if (distance > longestDistance) {
                    longestDistance = distance;
                }
                room = orgRoom;
                distance = room.distance;
                xyCords = room.getCord();
                currentX = xyCords.x;
                currentY = xyCords.y;
                break;
            case '(':
                //new subgroup
                ({ stringPos, longestDistance } = createCastle(room, stringPos));
                distance = longestDistance;
                longestDistance = distance;
                break;
            default:
                throw 'Unexpected value in regEx';
                break;
        }
    }
}

let roomMap: Map<string, Room>;
let globalString: string;


function partB(typeOfData: string): number {
    roomMap = new Map;
    let input: string = processInput(typeOfData);
    globalString = input.slice(1);
    let startX = 0;
    let startY = 0;
    let distance = 0;
    let firstRoom = new Room('firstRoom', null, distance);
    let currentCord = firstRoom.setCord(startX, startY);
    roomMap.set(currentCord, firstRoom);
    createCastle(firstRoom, 0);

    let count = 0;
    distance = 0;
    roomMap.forEach(room => {
        if (room.distance > 999) {
            count++;
        }
        if (room.distance > distance) {
            distance = room.distance;
        }
    })

    return count;
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
