import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { assert } from "console";
import { type } from "os";
const readFile = util.promisify(fs.readFile);

class Marble {
    id: number;
    next: Marble;
    previous: Marble;
    constructor(id: number) {
        this.id = id;
    }

    getNextMarble() {
        return this.next;
    }

    getPreviousMarble() {
        return this.previous;
    }

    insertAsNextMarbleInCircle(marble: Marble) {
        if (this.next != null) {
            let existingNextMarble = this.getNextMarble();
            existingNextMarble.previous = marble;
            marble.setNextMarble(existingNextMarble);
        }
        marble.setPerviousMarble(this);
        this.next = marble;

    }

    setNextMarble(marble: Marble) {
        this.next = marble;
    }

    setPerviousMarble(marble: Marble) {
        this.previous = marble;
    }

    removeMarbleFromCircle() {
        let existingNextMarble = this.getNextMarble();
        let existingPreviousMarble = this.getPreviousMarble();
        existingNextMarble.setPerviousMarble(existingPreviousMarble);
        existingPreviousMarble.setNextMarble(existingNextMarble);

        return existingNextMarble;
    }

    marbleXStepsForward(x: number) {
        let marble: Marble = this;
        for (let step = 0; step < x; step++) {
            marble = marble.getNextMarble();
        }
        return marble;
    }

    marbleXStepsBackward(x: number) {
        let marble: Marble = this;
        for (let step = 0; step < x; step++) {
            marble = marble.getPreviousMarble();
        }
        return marble;
    }
}


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
    let rawInput = inputData(typeofData).split(',');
    let inputArray: Array<number> = new Array();

    rawInput.forEach(element => {
        inputArray.push(+element);;
    })

    return inputArray;
}

function partA(typeOfData: string): number {
    let input: Array<number> = processInput(typeOfData);
    let maxScore: number = 0;
    const players: number = input[0];
    const maxNumberOfMarbels: number = input[1] + 1;
    let playerScore: Array<number> = new Array(players).fill(0);
    let currentPlayer: number = 0;

    let circle = new Marble(0);
    circle.next = circle;
    circle.previous = circle;
    let activeMarble: Marble = circle;

    for (let i = 1; i < maxNumberOfMarbels; i++) {
        let newMarble: Marble = new Marble(i);
        if ((newMarble.id % 23) != 0) {
            activeMarble = activeMarble.marbleXStepsForward(1);
            activeMarble.insertAsNextMarbleInCircle(newMarble);
            activeMarble = newMarble;
        } else {
            //The specialcase, save newMarble and remove the one 7 steps back
            playerScore[currentPlayer] += newMarble.id;
            activeMarble = activeMarble.marbleXStepsBackward(7);
            playerScore[currentPlayer] += activeMarble.id;
            activeMarble = activeMarble.removeMarbleFromCircle();
        }
        if (currentPlayer == players - 1) {
            currentPlayer = 0;
        } else {
            currentPlayer++;
        }
    }


    playerScore.forEach(playerScore => {
        if (playerScore > maxScore) {
            maxScore = playerScore;
        }
    })

    return maxScore;
}

function partB(typeOfData: string, noWorkers: number, offset: number): number {
    let input: Array<number> = processInput(typeOfData);

    let maxScore: number = 0;
    const players: number = input[0];
    const maxNumberOfMarbels: number = (input[1] * 100) + 1;
    let playerScore: Array<number> = new Array(players).fill(0);
    let currentPlayer: number = 0;

    let circle = new Marble(0);
    circle.next = circle;
    circle.previous = circle;
    let activeMarble: Marble = circle;

    for (let i = 1; i < maxNumberOfMarbels; i++) {
        let newMarble: Marble = new Marble(i);
        if ((newMarble.id % 23) != 0) {
            activeMarble = activeMarble.marbleXStepsForward(1);
            activeMarble.insertAsNextMarbleInCircle(newMarble);
            activeMarble = newMarble;
        } else {
            //The specialcase, save newMarble and remove the one 7 steps back
            playerScore[currentPlayer] += newMarble.id;
            activeMarble = activeMarble.marbleXStepsBackward(7);
            playerScore[currentPlayer] += activeMarble.id;
            activeMarble = activeMarble.removeMarbleFromCircle();
        }
        if (currentPlayer == players - 1) {
            currentPlayer = 0;
        } else {
            currentPlayer++;
        }
    }


    playerScore.forEach(playerScore => {
        if (playerScore > maxScore) {
            maxScore = playerScore;
        }
    })

    return maxScore;
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

        testCalc = partA('Test2');
        if (testCalc == test1_ex2Result) {
            console.log('Puzzle part 1 example 2 passed');
        } else {
            console.log('Puzzle part 1 example 2 failed got', testCalc, 'expected', test1_ex2Result);
        }
        testCalc = partA('Test3');
        if (testCalc == test1_ex3Result) {
            console.log('Puzzle part 1 example 3 passed');
        } else {
            console.log('Puzzle part 1 example 3 failed got', testCalc, 'expected', test1_ex3Result);
        }

    }
}

main();
