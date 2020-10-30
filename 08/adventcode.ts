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
    let rawInput = inputData(typeofData).split(' ');
    let inputArray: Array<number> = new Array();

    rawInput.forEach(element => {
        inputArray.push(+element);;
    })

    return inputArray;
}

function partA(typeOfData: string) {
    let input: Array<number> = processInput(typeOfData);

    //define an interface 
    interface node {
        numberChildNodes: number,
        numberMetadataEntries: number,
        metadataEntriesArray: Array<number>,
    }

    let nodeArray: Array<node> = new Array;

    nodeParsing(input);

    let sum: number = 0;
    nodeArray.forEach(element => {
        element.metadataEntriesArray.forEach(metadataEntry => {
            sum += metadataEntry;
        });
    });

    return sum;

    function nodeParsing(inputArray: Array<number>) {
        let _node: node = {
            numberChildNodes: inputArray.shift(),
            numberMetadataEntries: inputArray.shift(),
            metadataEntriesArray: new Array,
        };

        //Do recursive for the subnodes
        for (let Nodeindex = 0; Nodeindex < _node.numberChildNodes; Nodeindex++) {
            nodeParsing(inputArray);
        }

        //Take the meta data
        for (let MetadataEntries = 0; MetadataEntries < _node.numberMetadataEntries; MetadataEntries++) {
            _node.metadataEntriesArray.push(inputArray.shift());
        }

        nodeArray.push(_node);
    }
}

function partB(typeOfData: string, noWorkers: number, offset: number) {
    let input: Array<number> = processInput(typeOfData);

    //define an interface 
    interface node {
        numberChildNodes: number,
        numberMetadataEntries: number,
        metadataEntriesArray: Array<number>,
        nodeNumber: string,
    }

    let nodeMap: Map<string, node> = new Map;
    let nodeName: string = '0';

    nodeParsing(input, nodeName);

    let sum: number = 0;
    let position: number = 0;

    sum = calcChecksum(nodeName);

    return sum;

    function calcChecksum(_name: string): number {
        let _node: node;
        _node = nodeMap.get(_name);
        if (_node.numberChildNodes == 0) {
            //No child nodes
            let _sum: number = 0;
            _node.metadataEntriesArray.forEach(element => {
                _sum += element;
            });
            return _sum;
        } else {
            //Child nodes take those that should be used
            let _sum: number = 0;
            _node.metadataEntriesArray.forEach(element => {
                if ((element < _node.numberChildNodes + 1) && (element != 0)) {
                    //This is a reference to a child, however starting with 1
                    _sum += calcChecksum(_name + ',' + (element - 1));
                } else {
                    //No matching child node, dont count it
                }
            });
            return _sum;
        }


    }

    function nodeParsing(inputArray: Array<number>, _nodeName: string) {
        let _node: node = {
            numberChildNodes: inputArray.shift(),
            numberMetadataEntries: inputArray.shift(),
            metadataEntriesArray: new Array,
            nodeNumber: _nodeName,
        };

        //Do recursive for the subnodes
        for (let _nodeIndex = 0; _nodeIndex < _node.numberChildNodes; _nodeIndex++) {
            nodeParsing(inputArray, _nodeName + ',' + _nodeIndex);
        }

        //Take the meta data
        for (let MetadataEntries = 0; MetadataEntries < _node.numberMetadataEntries; MetadataEntries++) {
            _node.metadataEntriesArray.push(inputArray.shift());
        }

        nodeMap.set(_nodeName, _node);
    }
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
