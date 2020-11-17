import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
import { assert } from "console";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

const A = 0;
const B = 1;
const C = 2;

class OpCodeExecuter {
    ip: number;
    registry: Array<number>;

    constructor(registryInput: Array<number>) {
        this.registry = registryInput.slice();
        this.ip = 0;
    }

    addr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] + this.registry[input[B]];
        this.registry = output;
    }
    addi(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] + input[B];
        this.registry = output;
    }

    mulr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] * this.registry[input[B]];
        this.registry = output;
    }

    muli(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] * input[B];
        this.registry = output;
    }

    banr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] & this.registry[input[B]];
        this.registry = output;
    }

    bani(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] & input[B];
        this.registry = output;
    }

    borr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] | this.registry[input[B]];
        this.registry = output;
    }

    bori(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]] | input[B];
        this.registry = output;
    }

    setr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = this.registry[input[A]];
        this.registry = output;
    }

    seti(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        output[input[C]] = input[A];
        this.registry = output;
    }

    gtir(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[A] > this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
    }

    gtri(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[B] < this.registry[input[A]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
    }


    gtrr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (this.registry[input[A]] > this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
    }

    eqir(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[A] == this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
    }

    eqri(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (input[B] == this.registry[input[A]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
    }

    eqrr(input: Array<number>) {
        let output: Array<number> = new Array;
        output = this.registry.slice();

        if (this.registry[input[A]] == this.registry[input[B]]) {
            output[input[C]] = 1;
        } else {
            output[input[C]] = 0;
        }
        this.registry = output;
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
        default:
            break;
    }
    return returnData;
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);

    let inputArray: Array<string> = new Array();
    const regex: RegExp = /\w{4}|\d+/gm;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

interface CodeBlock {
    command: string;
    dataArray: Array<number>
}

function partA(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let op = new OpCodeExecuter([0, 0, 0, 0, 0, 0])

    let IpRegestry: number = +input.shift();
    let command: string;
    let dataArray: Array<number> = new Array;
    let codeArray: Array<CodeBlock> = new Array;

    while (input.length > 0) {
        let codeBlock: CodeBlock = {
            command: input.shift(),
            dataArray: [+input.shift(), +input.shift(), +input.shift()]
        };
        codeArray.push(codeBlock);
    }

    let cont = true;
    let ip = op.registry[IpRegestry];

    while (cont) {
        op.registry[IpRegestry] = ip;
        let codeBlock = codeArray[ip];
        switch (codeBlock.command) {
            case 'addr':
                op.addr(codeBlock.dataArray);
                break;
            case 'addi':
                op.addi(codeBlock.dataArray);
                break;
            case 'mulr':
                op.mulr(codeBlock.dataArray);
                break;
            case 'muli':
                op.muli(codeBlock.dataArray);
                break;
            case 'banr':
                op.banr(codeBlock.dataArray);
                break;
            case 'bani':
                op.bani(codeBlock.dataArray);
                break;
            case 'borr':
                op.borr(codeBlock.dataArray);
                break;
            case 'bori':
                op.bori(codeBlock.dataArray);
                break;
            case 'setr':
                op.setr(codeBlock.dataArray);
                break;
            case 'seti':
                op.seti(codeBlock.dataArray);
                break;
            case 'gtir':
                op.gtir(codeBlock.dataArray);
                break;
            case 'gtri':
                op.gtri(codeBlock.dataArray)
                break;
            case 'gtrr':
                op.gtrr(codeBlock.dataArray);
                break;
            case 'eqir':
                op.eqir(codeBlock.dataArray);
                break;
            case 'eqri':
                op.eqri(codeBlock.dataArray);
                break;
            case 'eqrr':
                op.eqrr(codeBlock.dataArray);
                break;
            default:
                assert('Unexpected command', codeBlock.command);
                break;
        }
        ip = op.registry[IpRegestry]
        ip++;
        if ((ip < 0) || (ip >= codeArray.length)) {
            //Ip out of bounds stop
            cont = false
        }
    }
    return op.registry[0];
}

function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let op = new OpCodeExecuter([1, 0, 0, 0, 0, 0])

    let IpRegestry: number = +input.shift();
    let command: string;
    let dataArray: Array<number> = new Array;
    let codeArray: Array<CodeBlock> = new Array;

    while (input.length > 0) {
        let codeBlock: CodeBlock = {
            command: input.shift(),
            dataArray: [+input.shift(), +input.shift(), +input.shift()]
        };
        codeArray.push(codeBlock);
    }

    let cont = true;
    let ip = op.registry[IpRegestry];

    while (cont) {
        op.registry[IpRegestry] = ip;
        let codeBlock = codeArray[ip];
        switch (codeBlock.command) {
            case 'addr':
                op.addr(codeBlock.dataArray);
                break;
            case 'addi':
                op.addi(codeBlock.dataArray);
                break;
            case 'mulr':
                op.mulr(codeBlock.dataArray);
                break;
            case 'muli':
                op.muli(codeBlock.dataArray);
                break;
            case 'banr':
                op.banr(codeBlock.dataArray);
                break;
            case 'bani':
                op.bani(codeBlock.dataArray);
                break;
            case 'borr':
                op.borr(codeBlock.dataArray);
                break;
            case 'bori':
                op.bori(codeBlock.dataArray);
                break;
            case 'setr':
                op.setr(codeBlock.dataArray);
                break;
            case 'seti':
                op.seti(codeBlock.dataArray);
                break;
            case 'gtir':
                op.gtir(codeBlock.dataArray);
                break;
            case 'gtri':
                op.gtri(codeBlock.dataArray)
                break;
            case 'gtrr':
                op.gtrr(codeBlock.dataArray);
                break;
            case 'eqir':
                op.eqir(codeBlock.dataArray);
                break;
            case 'eqri':
                op.eqri(codeBlock.dataArray);
                break;
            case 'eqrr':
                op.eqrr(codeBlock.dataArray);
                break;
            default:
                assert('Unexpected command', codeBlock.command);
                break;
        }
        ip = op.registry[IpRegestry]
        ip++;
        if ((ip < 0) || (ip >= codeArray.length)) {
            //Ip out of bounds stop
            cont = false
        }
    }
    return op.registry[0];
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
