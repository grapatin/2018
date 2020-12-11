import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
const readFile = util.promisify(fs.readFile);


let registers: Array<number> = new Array;
const reg0 = 0;
const reg1 = 1;
const reg2 = 2;
const reg3 = 3;

const A = 1;
const B = 2;
const C = 3;
let knownfunctionArray = new Array;

class OpCodeExecuter {
    functionArray = new Array;
    registry: Array<number>;

    constructor(registryInput: Array<number>) {
        this.registry = registryInput.slice();

        this.functionArray.push(this.addr);
        this.functionArray.push(this.addi);
        this.functionArray.push(this.mulr);
        this.functionArray.push(this.muli);

        this.functionArray.push(this.banr);
        this.functionArray.push(this.bani);
        this.functionArray.push(this.borr);
        this.functionArray.push(this.bori);

        this.functionArray.push(this.setr);
        this.functionArray.push(this.seti);
        this.functionArray.push(this.gtir);
        this.functionArray.push(this.gtri);

        this.functionArray.push(this.gtrr);
        this.functionArray.push(this.eqir);
        this.functionArray.push(this.eqri);
        this.functionArray.push(this.eqrr);
    }


    addr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] + this.registry[input[B]];
        return output;
    }
    addi(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] + input[B];
        return output;
    }

    mulr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] * this.registry[input[B]];
        return output;
    }

    muli(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] * input[B];
        return output;
    }

    banr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] & this.registry[input[B]];
        return output;
    }

    bani(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] & input[B];
        return output;
    }

    borr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] | this.registry[input[B]];
        return output;
    }

    bori(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] | input[B];
        return output;
    }

    setr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]];
        return output;
    }

    seti(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = input[A];
        return output;
    }

    gtir(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[A] > this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }

    gtri(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[B] < this.registry[input[A]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }


    gtrr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (this.registry[input[A]] > this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }

    eqir(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[A] == this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }

    eqri(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[B] == this.registry[input[A]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }

    eqrr(input: Array<number>): Array<number> {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (this.registry[input[A]] == this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        return output;
    }

    checkHowManyFunctionsThatWork(commandArray: Array<number>, expectedResultArray: Array<number>) {
        let match = 0;
        let functionsThatWork = new Array;
        this.functionArray.forEach(func => {
            let resultArray = func.call(this, commandArray);
            if (resultArray.join() == expectedResultArray.join()) {
                match++
                functionsThatWork.push(func);
            }

        });
        return { match, functionsThatWork };
    }

    removeKnownFunction(func) {
        let index = this.functionArray.findIndex(el => el == func);
        if (index > -1) {
            this.functionArray.splice(index, 1);
        }
    }
}


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
        case 'Part2':
            let fileString2 = fs.readFileSync('./puzzleInput2.txt', 'utf8');
            returnData = fileString2;
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

function partA(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let count = 0;

    for (let i = 0; i < input.length; i = i + 3 * 4) {
        let startState = [+input[i], +input[i + 1], +input[i + 2], +input[i + 3]];
        let opCodeArray = [+input[i + 4], +input[i + 5], +input[i + 6], +input[i + 7]];
        let expectedResultArray = [+input[i + 8], +input[i + 9], +input[i + 10], +input[i + 11]];
        let executorClass = new OpCodeExecuter(startState);
        let functionsThatWork = new Array;
        let match: number;

        ({ match, functionsThatWork } = executorClass.checkHowManyFunctionsThatWork(opCodeArray, expectedResultArray));
        if (match > 2) {
            count++;
        }
    }

    return count;
}

function partB(typeOfData: string): number {
    let input: Array<String> = processInput(typeOfData);
    let count = 0;
    let opCodeFunc = new Array;

    LearnOpCodes();

    input = processInput('Part2');
    let calc = new OpCodeExecuter([0, 0, 0, 0]);

    for (let i = 0; i < input.length; i = i + 4) {
        let opCodeArray = [+input[i], +input[i + 1], +input[i + 2], +input[i + 3]];
        calc.registry = opCodeFunc[opCodeArray[0]].call(calc, opCodeArray);
    }


    return calc.registry[0];

    function LearnOpCodes() {
        while (knownfunctionArray.length < 16) {
            for (let i = 0; i < input.length; i = i + 3 * 4) {
                let startState = [+input[i], +input[i + 1], +input[i + 2], +input[i + 3]];
                let opCodeArray = [+input[i + 4], +input[i + 5], +input[i + 6], +input[i + 7]];
                let expectedResultArray = [+input[i + 8], +input[i + 9], +input[i + 10], +input[i + 11]];
                let executorClass = new OpCodeExecuter(startState);
                knownfunctionArray.forEach(el => {
                    executorClass.removeKnownFunction(el);
                });
                let functionsThatWork = new Array;
                let match: number;

                ({ match, functionsThatWork } = executorClass.checkHowManyFunctionsThatWork(opCodeArray, expectedResultArray));
                if (match == 1) {
                    opCodeFunc[opCodeArray[0]] = functionsThatWork[0];
                    knownfunctionArray.push(functionsThatWork[0]);
                }
            }
        }
    }
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
