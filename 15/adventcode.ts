import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import { assert } from "console";
import { type } from "os";

class WriteOutput {
    fileName = 'output.txt'
    constructor() {
        //Clear out the file
        fs.writeFileSync(this.fileName, '');
    }

    writeDungeonState(dungenToPrint: Dungeon) {
        dungenToPrint.dungeonMap.forEach(line => {
            let outputChars: string = '';
            let elvesandGoblinsFound: string = '  :';
            line.forEach(char => {
                if (char[0] == 'G') {
                    outputChars += 'G'
                    elvesandGoblinsFound += char + '(' + dungenToPrint.goblinsAndElvesMap.get(char).hp + ')';
                } else if (char[0] == 'E') {
                    outputChars += 'E'
                    elvesandGoblinsFound += char + '(' + dungenToPrint.goblinsAndElvesMap.get(char).hp + ')';
                } else {
                    outputChars += char;
                }
            })
            elvesandGoblinsFound += '\n';
            fs.appendFileSync(this.fileName, outputChars + elvesandGoblinsFound);
        })
        fs.appendFileSync(this.fileName, '\n');
        fs.appendFileSync(this.fileName, '\n');
    }
    writeLine(line: string) {
        fs.appendFileSync(this.fileName, line + '\n');
    }
}


function inputData(typeOfData: String) {
    let returnData: string;
    //load data    
    if (typeOfData.startsWith('T1_')) {
        let num = typeOfData.substring(3);
        returnData = puzzle1_ex[+num];
    }
    switch (typeOfData) {
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

    let inputArray: Array<String> = new Array();
    const regex: RegExp = /[#.GE]+/ugm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

enum GoblinOrElvEnum {
    Goblin = -1,
    Elv = 1
}
const EnemyArray = new Array(GoblinOrElvEnum.Elv, GoblinOrElvEnum.Goblin);

class GoblinOrElv {
    hp: number = 200;
    xCord: number;
    yCord: number;
    GoblinOrElv: GoblinOrElvEnum;
    char: string;

    ClosestEnemyPath: string;
    ClosestEnemy: GoblinOrElv;

    constructor(xCord, yCord, char) {
        this.xCord = xCord;
        this.yCord = yCord;
        this.char = char;
        if (char[0] == 'G') {
            this.GoblinOrElv = GoblinOrElvEnum.Goblin;
        } else {
            this.GoblinOrElv = GoblinOrElvEnum.Elv;
        }
    }
    static isItAGoblinorElve(char): boolean {
        if ((char[0] == 'G') || (char[0] == 'E')) {
            return true;
        } else {
            return false;
        }
    }
    setClosetsEnemy(enemy: GoblinOrElv, path: string) {
        this.ClosestEnemy = enemy;
        this.ClosestEnemyPath = path;
    }
}

class Dungeon {
    dungeonMap: Array<Array<string>> = new Array;
    tempCopyOfMap: Array<Array<string>> = new Array;
    goblinsAndElvesArray: Array<GoblinOrElv> = new Array;
    goblinsAndElvesMap: Map<string, GoblinOrElv> = new Map
    tempClosestEnemyX: number;
    tempClosestEnemyY: number;
    tempClosestEnemyStepsAway: number;
    tempClosestEnemyPath: string;
    tempClosestEnemyName: string;
    //0 => Up, 1 = left, 2 = right, 3 = down 
    xM: Array<number> = new Array(0, -1, 1, 0);
    yM: Array<number> = new Array(-1, 0, 0, 1);

    constructor(input: Array<String>) {
        let geNumber = 0;
        //find Goblins and Elves -> create a goblinandElvese class, add them to a dungeon class
        input.forEach((row, indexY) => {
            this.dungeonMap[indexY] = new Array;
            row.split('').forEach((char, indexX) => {
                if (GoblinOrElv.isItAGoblinorElve(char)) {
                    char += geNumber;
                    geNumber++;
                    //console.log('GoblinOrElve:', char, 'fond at', indexX + ',' + indexY)
                    let goblinOrElve = new GoblinOrElv(indexX, indexY, char);
                    this.addGoblingOrElve(goblinOrElve);
                }
                this.dungeonMap[indexY][indexX] = char;
            });
        });

        this.sortInReadingOrder();
    }

    addGoblingOrElve(goblinOrElve: GoblinOrElv) {
        this.goblinsAndElvesArray.push(goblinOrElve);
        this.goblinsAndElvesMap.set(goblinOrElve.char, goblinOrElve);
    }

    sortInReadingOrder() {
        this.goblinsAndElvesArray.sort((a, b) => {
            if (a.yCord > b.yCord) {
                return 1;
            }
            if (a.yCord < b.yCord) {
                return -1;
            }
            if (a.yCord == b.yCord) {
                if (a.xCord > b.xCord) {
                    return +1;
                }
                if (a.xCord < b.xCord) {
                    return -1;
                }
                // a must be equal to b
                return 0
            }
        })
    }

    //recursive function searching through the MAP and stores number of steps
    //Allways go reading order (up, left, rigth, down), until stop
    explore(steps: number, startGoE: GoblinOrElv, path: string, x: number, y: number) {
        let enemy = startGoE.GoblinOrElv * -1;

        //Don't proceed if an enemy is already detected on shorter distance (TODO what if same distance?)
        steps++;
        for (let i = 0; i < 4; i++) {
            if (steps < this.tempClosestEnemyStepsAway) {
                let newX = x + this.xM[i];
                let newY = y + this.yM[i];
                let char = this.tempCopyOfMap[newY][newX];
                if ((char == '.') || (steps < +char)) {
                    //free space we can move here (NaN will convert to false)
                    this.tempCopyOfMap[newY][newX] = steps.toString();
                    this.explore(steps, startGoE, path + i, newX, newY);
                } else {
                    switch (char[0]) {
                        case 'G':
                            if (enemy == GoblinOrElvEnum.Goblin) {
                                //enemy found!
                                this.tempClosestEnemyStepsAway = steps;
                                this.tempClosestEnemyX = newX;
                                this.tempClosestEnemyY = newY;
                                this.tempClosestEnemyPath = path + i;
                                this.tempClosestEnemyName = char;
                                //console.log(startGoE.char, 'found enemy Goblin', char, 'at', newX, newY, 'steps away:', steps, 'With path', path + i);
                            } else {
                                //Friend found! Stop seaching
                            }
                            break;
                        case 'E':
                            if (enemy == GoblinOrElvEnum.Elv) {
                                this.tempClosestEnemyStepsAway = steps;
                                this.tempClosestEnemyX = newX;
                                this.tempClosestEnemyY = newY;
                                this.tempClosestEnemyPath = path + i;
                                this.tempClosestEnemyName = char;
                                //console.log(startGoE.char, 'found enemy Elv', char, 'at', newX, newY, 'steps away:', steps, 'With path', path + i);
                            } else {
                                //Friend found! Stop seaching
                            }
                            break;
                        case '#':
                            //wall found stop searching
                            break;
                    }
                }
            }
        }
    }


    findClosestEnemy(GoE: GoblinOrElv) {
        let enemy = null;
        //Create local copy of map
        this.tempCopyOfMap = this.dungeonMap.map(function (arr) {
            return arr.slice();
        });
        this.tempClosestEnemyStepsAway = Number.MAX_VALUE;
        this.tempClosestEnemyName = ''

        let path: string = '';
        //Search maze in reading order (up, left, rigth, down)
        this.explore(0, GoE, path, GoE.xCord, GoE.yCord);
        //        console.log(GoE.char, 'found enemy Elv', this.tempClosestEnemyName, 'at', this.tempClosestEnemyX, this.tempClosestEnemyY, 'steps away:', this.tempClosestEnemyStepsAway, 'With path', this.tempClosestEnemyPath);
        if (this.tempClosestEnemyStepsAway == 1) {
            //we need to find the enemy with lowest hp if there are multiple, check in all 4 directions
            let lowhp = Number.MAX_SAFE_INTEGER;
            for (let i = 0; i < 4; i++) {
                let char = this.dungeonMap[GoE.yCord + this.yM[i]][GoE.xCord + this.xM[i]];
                if (this.goblinsAndElvesMap.has(char)) {
                    let possibleEnemy = this.goblinsAndElvesMap.get(char);
                    //Also make sure they are enemies
                    if ((possibleEnemy.hp < lowhp) && (possibleEnemy.GoblinOrElv != GoE.GoblinOrElv)) {
                        lowhp = possibleEnemy.hp;
                        enemy = possibleEnemy;
                    }
                }
            }
        } else {
            if (this.goblinsAndElvesMap.has(this.tempClosestEnemyName)) {
                enemy = this.goblinsAndElvesMap.get(this.tempClosestEnemyName);
            }
        }

        return enemy;
    }

    AreTheyOnAttackDistance(GoE: GoblinOrElv, Enemy: GoblinOrElv) {
        if (GoE.ClosestEnemyPath.length == 1) {
            return true;
        } else {
            return false;
        }
    }

    moveAgainstEnemy(GoE: GoblinOrElv) {
        let direction = GoE.ClosestEnemyPath[0];
        GoE.ClosestEnemyPath = GoE.ClosestEnemyPath.substring(1);

        let xDir = this.xM[direction];
        let yDir = this.yM[direction];

        //set . on existion position
        this.dungeonMap[GoE.yCord][GoE.xCord] = '.';
        GoE.yCord += yDir;
        GoE.xCord += xDir;
        //set char on new position
        this.dungeonMap[GoE.yCord][GoE.xCord] = GoE.char;
    }

    removeGoE(GoE: GoblinOrElv) {
        //delete from map
        this.dungeonMap[GoE.yCord][GoE.xCord] = '.';
        this.goblinsAndElvesMap.delete(GoE.char);
        let index = this.goblinsAndElvesArray.indexOf(GoE);
        if (index > -1) {
            this.goblinsAndElvesArray.splice(index, 1);
        }
        else {
            assert(true, 'Unexpected error');
        }

    }

    AreThereAnyGoblinsLeft(): boolean {
        return this.goblinsAndElvesArray.some(element =>
            element.GoblinOrElv == GoblinOrElvEnum.Goblin
        )
    }

    AreThereAnyElvesLeft(): boolean {
        return this.goblinsAndElvesArray.some(element =>
            element.GoblinOrElv == GoblinOrElvEnum.Elv
        )
    }

    actionTime() {
        this.goblinsAndElvesArray.forEach((GoE => {
            let enemy: GoblinOrElv = this.findClosestEnemy(GoE);
            if (enemy != null) {
                GoE.setClosetsEnemy(enemy, this.tempClosestEnemyPath);
                let combatTime = this.AreTheyOnAttackDistance(GoE, enemy);
                if (combatTime) {
                    enemy.hp -= 3
                    if (enemy.hp < 1) {
                        this.removeGoE(enemy);
                    }
                } else {
                    this.moveAgainstEnemy(GoE);
                    enemy = this.findClosestEnemy(GoE);
                    combatTime = this.AreTheyOnAttackDistance(GoE, enemy);
                    if (combatTime) {
                        enemy.hp -= 3
                        if (enemy.hp < 1) {
                            this.removeGoE(enemy);
                        }
                    }
                }
            }
        }))
        this.sortInReadingOrder();
    }
}

function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);

    let dungeon = new Dungeon(input);
    let writeOut = new WriteOutput();
    writeOut.writeLine('Round :0');
    writeOut.writeDungeonState(dungeon);
    let cont = true;
    let rounds = 0;
    while (cont) {
        dungeon.actionTime();
        let ElvesLeft = dungeon.AreThereAnyElvesLeft();
        let GoblinsLeft = dungeon.AreThereAnyGoblinsLeft();
        if ((ElvesLeft == false) || (GoblinsLeft == false)) {
            cont = false;
        } else {
            rounds++;
        }
        writeOut.writeLine('Round :' + rounds);
        writeOut.writeDungeonState(dungeon);
    }
    //Calculate score
    let score = 0;
    dungeon.goblinsAndElvesMap.forEach(Element => {
        score += Element.hp;
    })
    score = score * rounds;
    return score;
}

function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);

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
