import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { strictEqual } from "assert";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();
const maxFactor = 7;

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

    let inputArray: Array<String> = new Array();
    const regex: RegExp = /\d+/gm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

enum tool {
    climbing,
    torch,
    neither
}

const rocky = 0;
const wet = 1;
const narrow = 2;

class Cord {
    private _geolicalIndex: number;
    private _depth: number;
    stateMap: Map<tool, number>

    readonly _factor: number;

    constructor(depth, geolicalIndex) {
        this._factor = 20183;
        this._depth = depth;
        this._geolicalIndex = geolicalIndex;
        this.stateMap = new Map;
        this.stateMap.set(tool.climbing, Number.MAX_SAFE_INTEGER);
        this.stateMap.set(tool.torch, Number.MAX_SAFE_INTEGER);
        this.stateMap.set(tool.neither, Number.MAX_SAFE_INTEGER);
    }

    get erosionLevel(): number {
        return (this._geolicalIndex + this._depth) % this._factor;
    }

    get typeChar(): string {
        let calc = this.erosionLevel % 3;
        switch (calc) {
            case rocky:
                return '.';
                break;
            case wet:
                return '=';
                break;
            case narrow:
                return '|';
                break;
            default:
                throw ('Unexpected value')
                break;
        }
    }

    get risk(): number {
        let calc = this.erosionLevel % 3;
        switch (calc) {
            case rocky:
                return 0;
                break;
            case wet:
                return 1;
                break;
            case narrow:
                return 2;
                break;
            default:
                throw ('Unexpected value')
                break;
        }
    }
}

class ModeMaze {
    mazeArray_yx: Array<Array<Cord>>;
    targetX: number;
    targetY: number;
    depth: number;
    totalRisk: number;

    calcGeologicalIndex(x: number, y: number): number {
        const xTimes = 16807; //Used when y = 0
        const yTimes = 48271; //Used when x = 0
        if ((x == 0) && (y == 0)) {
            return 0
        };
        if ((x == this.targetX) && (y === this.targetY)) {
            return 0
        }
        if (x == 0) {
            return y * yTimes;
        } else if (y == 0) {
            return x * xTimes;
        } else {
            return this.mazeArray_yx[y - 1][x].erosionLevel * this.mazeArray_yx[y][x - 1].erosionLevel;
        }
    }

    constructor(depth, target_x, target_y) {
        this.mazeArray_yx = new Array;

        this.targetY = target_y;
        this.targetX = target_x;

        let size_y = maxFactor * target_y;
        let size_x = maxFactor * target_x;
        this.depth = depth;
        let risk = 0;

        for (let y = 0; y < size_y + 1; y++) {
            let xRow = new Array;
            this.mazeArray_yx.push(xRow);
            for (let x = 0; x < size_x + 1; x++) {
                let geoIndex = this.calcGeologicalIndex(x, y);
                let cord = new Cord(this.depth, geoIndex);
                xRow.push(cord);
                if (!((x > this.targetX) || (y > this.targetY))) {
                    risk += cord.risk;
                }
            }
        }
        this.totalRisk = risk;
    }
}

function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);

    let depth = +input[0];
    let x = +input[1];
    let y = +input[2];
    let modeMaze = new ModeMaze(depth, x, y);

    return modeMaze.totalRisk;
}

interface moveState {
    continue: boolean,
    tool: tool,
}

/*In rocky regions, you can use the climbing gear or the torch. You cannot use neither (you'll likely slip and fall).
In wet regions, you can use the climbing gear or neither tool. You cannot use the torch (if it gets wet, you won't have a light source).
In narrow regions, you can use the torch or neither tool. You cannot use the climbing gear (it's too bulky to fit).
*/
class MazeWalker {
    private targetX;
    private targetY;
    private maze: ModeMaze;
    private mazeMaxBeforeStop;

    constructor(targetX, targetY, maze: ModeMaze) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.maze = maze;
        this.maze.mazeArray_yx[0][0].stateMap.set(tool.torch, 0);
        this.mazeMaxBeforeStop = Math.min((targetX + targetY) * 7, 1118); //teoretical max we know it is less than 1117
    }

    get minTimeSoFar() {
        return this.maze.mazeArray_yx[this.targetY][this.targetX].stateMap.get(tool.torch);
    }
    /*  rocky{.} = {climbing, torch}, !neither
        wet{=} = {climbing, neither}, !torch
        narrow{|} = {torch, neither}, !climbing*/
    // Y,X > 0, try all directions and tools (1,2) => 8 choices for each move
    //but stop as soon as out of bounds or shorter way found (combination of pos and tool)
    //Direction is South, East, North, West
    searchThroughMaze(x, y, currentTool: tool) {
        let currentTime = this.maze.mazeArray_yx[y][x].stateMap.get(currentTool);
        const x_delta = [0, 1, 0, -1, 0, 1, 0, -1];
        const y_delta = [1, 0, -1, -1, 1, 0, -1, -1];
        const tool = [1, 1, 1, 1, 2, 2, 2, 2];
        let newX;
        let newY;

        for (let i = 0; i < x_delta.length; i++) {
            newX = x + x_delta[i];
            newY = y + y_delta[i];
            if (((newX > -1) && (newY > -1)) && ((newX < this.targetX * maxFactor) && (newY < this.targetY * maxFactor))) {

                let _movestate = this.move(newY, newX, tool[i], currentTime, currentTool);
                if (_movestate.continue == true) {
                    this.searchThroughMaze(newX, newY, _movestate.tool);
                }
            }
        }
    }

    private move(y: number, x: number, changeTool: number, currentTime, currentTool): moveState {
        let targetFound = false;
        switch (this.maze.mazeArray_yx[y][x].typeChar) {
            case '.':
                //Get the special case that we are at target
                if ((x == this.targetX) && (y == this.targetY)) {
                    if (currentTool != tool.torch) {
                        //Switch to torch
                        currentTime += 7;
                        currentTool = tool.torch;
                    }
                    targetFound = true;
                }
                if (currentTool == tool.neither) {
                    //Switch tool
                    if (changeTool == 1) {
                        currentTool = tool.climbing;
                    } else {
                        currentTool = tool.torch;
                    }
                    currentTime += 7;
                }
                //Tool correct move to cord
                currentTime++;
                break;
            case '=':
                if (currentTool == tool.torch) {
                    currentTime += 7;
                    if (changeTool == 1) {
                        currentTool = tool.neither;
                    } else {
                        currentTool = tool.climbing;
                    }
                }
                //Move
                currentTime++;
                break;
            case '|':
                if (currentTool == tool.climbing) {
                    currentTime += 7;
                    if (changeTool == 1) {
                        currentTool = tool.torch;
                    } else {
                        currentTool = tool.neither;
                    }
                }
                currentTime++;
                break;
            default:
                throw ('Unexpected typeChar');
        }
        let currentBest = this.maze.mazeArray_yx[y][x].stateMap.get(currentTool);
        if ((currentTime < currentBest) && (currentTime < this.mazeMaxBeforeStop) && (targetFound == false)) {
            this.maze.mazeArray_yx[y][x].stateMap.set(currentTool, currentTime);
            let _moveState: moveState = {
                continue: true,
                tool: currentTool
            }
            return _moveState;
        } else {
            //Another shorter way found, no need to continue or we are at target
            if (targetFound == true) {
                this.mazeMaxBeforeStop = currentTime;
                if (currentTime < currentBest) {
                    this.maze.mazeArray_yx[y][x].stateMap.set(currentTool, currentTime);
                }
            }
            let _moveState: moveState = {
                continue: false,
                tool: currentTool
            }
            return _moveState;
        }
    }
}


function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);

    let depth = +input[0];
    let x = +input[1];
    let y = +input[2];
    let modeMaze = new ModeMaze(depth, x, y);
    let timeLapsed = 0;
    let walker = new MazeWalker(x, y, modeMaze);

    walker.searchThroughMaze(0, 0, tool.torch);


    console.log('Done!')
    return walker.minTimeSoFar;
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
