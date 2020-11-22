import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

interface CodeBlock {
    command: string;
    dataArray: Array<number>
}

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
    //Add register*
    addr(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A + register_B;

        this.registry[output] = result;
    }
    //add immediate*
    addi(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A + input_B;

        this.registry[output] = result;
    }

    //multiply register*
    mulr(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A * register_B;

        this.registry[output] = result;
    }

    //multiply immediate*1
    muli(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A * input_B;

        this.registry[output] = result;
    }

    //bitwise AND register
    banr(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A & register_B;

        this.registry[output] = result;
    }

    //bitwise AND immediate
    bani(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A & input_B;

        this.registry[output] = result;
    }

    //bitwise OR register
    borr(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A | register_B;

        this.registry[output] = result;

    }

    //bitwise OR immediate
    bori(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A | input_B;

        this.registry[output] = result;
    }

    //set register*
    setr(input: Array<number>) {
        let input_A = input[A];
        let input_B = input[B];
        let output = input[C];
        let register_A = this.registry[input_A];
        let register_B = this.registry[input_B];

        let result = register_A;

        this.registry[output] = result;
    }

    //set immediate*
    seti(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];

        let result = value_A;

        this.registry[output] = result;
    }

    //greater-than immediate/register
    gtir(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (value_A > register_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
    }

    //greater-than register/immediate
    gtri(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (register_A > value_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
    }

    //greater-than register/register*
    gtrr(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (register_A > register_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
    }

    //equal immediate/register
    eqir(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (value_A == register_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
    }

    //equal register/immediate
    eqri(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (register_A == value_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
    }

    //equal register/register*
    eqrr(input: Array<number>) {
        let value_A = input[A];
        let value_B = input[B];
        let output = input[C];
        let register_A = this.registry[value_A];
        let register_B = this.registry[value_B];
        let result: number;

        if (register_A == register_B) {
            result = 1;
        } else {
            result = 0;
        }
        this.registry[output] = result;
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

    let inputArray: Array<string> = new Array();
    const regex: RegExp = /[a-z]{4}|\d+/g;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })


    return inputArray;
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
    let commandsMap: Map<string, number> = new Map;


    while (cont) {
        op.registry[IpRegestry] = ip;
        let codeBlock = codeArray[ip];
        let count: number = 0;
        if (commandsMap.has(codeBlock.command)) {
            count = commandsMap.get(codeBlock.command);
        };
        commandsMap.set(codeBlock.command, ++count);
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
                return op.registry[3]; //this is the solution for first part
                break;
            default:
                throw ('Unexpected command');
                break;
        }
        ip = op.registry[IpRegestry]
        ip++;
        if ((ip < 0) || (ip >= codeArray.length)) {
            //Ip out of bounds stop
            cont = false
        }
    }
    console.log('CommandMap', commandsMap)
    return op.registry[0];



    return 0;
}

function partB(typeOfData: string): number {
    let input: Array<string> = processInput(typeOfData);

    let op = new OpCodeExecuter([0, 0, 0, 0, 0, 0])

    let IpRegestry: number = +input.shift();
    let command: string;
    let dataArray: Array<number> = new Array;
    let codeArray: Array<CodeBlock> = new Array;
    let resultSet: Set<number> = new Set;
    let maxFound = 0;

    while (input.length > 0) {
        let codeBlock: CodeBlock = {
            command: input.shift(),
            dataArray: [+input.shift(), +input.shift(), +input.shift()]
        };
        codeArray.push(codeBlock);
    }

    let cont = true;
    let ip = op.registry[IpRegestry];
    let commandsMap: Map<string, number> = new Map;


    while (cont) {
        op.registry[IpRegestry] = ip;
        let codeBlock = codeArray[ip];
        let count: number = 0;
        if (commandsMap.has(codeBlock.command)) {
            count = commandsMap.get(codeBlock.command);
        };
        commandsMap.set(codeBlock.command, ++count);
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
                if (resultSet.has(op.registry[3])) {
                    //The instruction before is the one that we should find
                    let tempA = [...resultSet];
                    return tempA[tempA.length - 1];
                }
                resultSet.add(op.registry[3]);
                op.eqrr(codeBlock.dataArray);
                if (op.registry[3] > maxFound) {
                    maxFound = op.registry[3];
                    console.log('New max found', maxFound);
                }
                break;
            default:
                throw ('Unexpected command');
                break;
        }
        ip = op.registry[IpRegestry]
        ip++;
        if ((ip < 0) || (ip >= codeArray.length)) {
            //Ip out of bounds stop
            cont = false
        }
    }
    console.log('CommandMap', commandsMap)
    return op.registry[0];

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
