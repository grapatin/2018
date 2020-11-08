import { puzzle1_ex1, puzzle1_ex2, puzzle1_ex3, puzzle2_ex1, puzzle2_ex2, puzzle2_ex3, test1_ex1Result, test1_ex2Result, test1_ex3Result, test2_ex1Result, test2_ex2Result, test2_ex3Result } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { dir } from "console";
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
    let rawInput = inputData(typeofData);

    let inputArray: Array<String> = new Array();
    const regex: RegExp = /.+/ug;;

    let temp = rawInput.match(regex);

    temp.forEach(element => {
        inputArray.push(element);
    })

    return inputArray;
}

enum directionEnum {
    left,
    up,
    right,
    down,
}

class Cart {
    xCord: number;
    yCord: number;
    direction: directionEnum;
    state = 0;
    crashed = false;

    constructor(xCord: number, yCord: number, charDir: string) {
        this.xCord = xCord;
        this.yCord = yCord;
        this.setDirection(charDir);
        this.state = 0;
    }

    private setDirection(charDir: string) {
        switch (charDir) {
            case '<':
                this.direction = directionEnum.left;
                break;
            case '>':
                this.direction = directionEnum.right;
                break;
            case '^':
                this.direction = directionEnum.up;
                break;
            case 'v':
                this.direction = directionEnum.down;
                break;
            default:
                break;
        }
    }

    static isItACart(char: string): boolean {
        switch (char) {
            case '<':
            case '>':
            case '^':
            case 'v':
                return true;
                break;
            default:
                return false;
                break;
        }
    }
}

class Track {
    cartsArray: Array<Cart>;
    kartan: Array<Array<string>>;

    constructor() {
        this.cartsArray = new Array;
    }
    addCart(cart: Cart) {
        this.cartsArray.push(cart);
    }
    sortCarts() {
        this.cartsArray.sort((a, b) => {
            if (a.yCord > b.yCord) {
                return 1;
            }
            if (a.yCord < b.yCord) {
                return -1;
            }
            if (a.yCord == b.yCord) {
                if (a.xCord > b.xCord) {
                    return 1;
                }
                if (a.xCord < a.xCord) {
                    return -1;
                }
                // a must be equal to b
                return 0
            }
        })
    }
    checkForCrash(): boolean {
        for (let i = 0; i < this.cartsArray.length - 1; i++) {
            let a = this.cartsArray[i];
            let b = this.cartsArray[i + 1];
            if (a.yCord == b.yCord) {
                if (a.xCord == b.xCord) {
                    return true;
                }
            }
        }
        return false;
    }
    checkForCrashAndMarkCarts(): number {
        for (let i = 0; i < this.cartsArray.length - 1; i++) {
            let a = this.cartsArray[i];
            let b = this.cartsArray[i + 1];
            if (a.yCord == b.yCord) {
                if ((a.xCord == b.xCord) && (a.crashed == false) && (b.crashed == false)) {
                    a.crashed = true;
                    b.crashed = true;
                }
            }
        }

        let tempArrayOfNotCrashedCars = this.cartsArray.filter(cart => {
            return cart.crashed == false;
        })
        return tempArrayOfNotCrashedCars.length;
    }
    removedCrashedCarts() {
        this.cartsArray = this.cartsArray.filter(cart => {
            return cart.crashed == false
        })
    }
    addKartan(kartan) {
        this.kartan = kartan;
    }
    moveCart(index: number) {
        let cart = this.cartsArray[index];
        switch (cart.direction) {
            case directionEnum.up:
                cart.yCord--;
                break;
            case directionEnum.down:
                cart.yCord++;
                break;
            case directionEnum.left:
                cart.xCord--;
                break;
            case directionEnum.right:
                cart.xCord++;
                break;
        }
        //Get Symbol at new position
        let symbol = this.kartan[cart.yCord][cart.xCord];
        //Get the new direction
        switch (symbol) {
            case 'b':
                switch (cart.direction) {
                    case directionEnum.up:
                        cart.direction = directionEnum.left;
                        break;
                    case directionEnum.down:
                        cart.direction = directionEnum.right;
                        break;
                    case directionEnum.left:
                        cart.direction = directionEnum.up;
                        break;
                    case directionEnum.right:
                        cart.direction = directionEnum.down;
                        break;
                }
                break;
            case '/':
                switch (cart.direction) {
                    case directionEnum.up:
                        cart.direction = directionEnum.right;
                        break;
                    case directionEnum.down:
                        cart.direction = directionEnum.left;
                        break;
                    case directionEnum.left:
                        cart.direction = directionEnum.down;
                        break;
                    case directionEnum.right:
                        cart.direction = directionEnum.up;
                        break;
                }
                break;
            case '+':
                switch (cart.state) {
                    case 0: //Go left
                        cart.state++;
                        switch (cart.direction) {
                            case directionEnum.up:
                                cart.direction = directionEnum.left;
                                break;
                            case directionEnum.down:
                                cart.direction = directionEnum.right;
                                break;
                            case directionEnum.left:
                                cart.direction = directionEnum.down;
                                break;
                            case directionEnum.right:
                                cart.direction = directionEnum.up;
                                break;
                        }
                        break;
                    case 1: //Go straight ahead
                        cart.state++;
                        break;
                    case 2: //Go rigth
                        cart.state = 0;
                        switch (cart.direction) {
                            case directionEnum.up:
                                cart.direction = directionEnum.right;
                                break;
                            case directionEnum.down:
                                cart.direction = directionEnum.left;
                                break;
                            case directionEnum.left:
                                cart.direction = directionEnum.up;
                                break;
                            case directionEnum.right:
                                cart.direction = directionEnum.down;
                                break;
                        }
                        break;
                }
                break;
            default:
                //Continue in current direction
                break;
        }
    }
}

function partA(typeOfData: string): string {
    let input: Array<String> = processInput(typeOfData);
    let track = new Track();
    let kartan: Array<Array<string>> = new Array;

    //find carts -> create a cart class, add them to a Track class
    input.forEach((row, indexY) => {
        kartan[indexY] = new Array;
        row.split('').forEach((char, indexX) => {
            if (Cart.isItACart(char)) {
                console.log('Cart fond at', indexX + ',' + indexY)
                let cart = new Cart(indexX, indexY, char);
                track.addCart(cart);
            }
            kartan[indexY][indexX] = char;
        });
    });
    track.addKartan(kartan);

    let cont: boolean = true;
    let returnString: string;
    while (cont) {
        track.sortCarts();
        for (let i = 0; i < track.cartsArray.length; i++) {
            track.moveCart(i);
            if (track.checkForCrash()) {
                returnString = track.cartsArray[i].xCord + ',' + track.cartsArray[i].yCord;
                console.log('Crash! at cart I', i, 'Cord', returnString);
                cont = false;
                break;
            }
        }
    }
    return returnString;
}

function partB(typeOfData: string): string {
    let input: Array<String> = processInput(typeOfData);
    let track = new Track();
    let kartan: Array<Array<string>> = new Array;

    //find carts -> create a cart class, add them to a Track class
    input.forEach((row, indexY) => {
        kartan[indexY] = new Array;
        row.split('').forEach((char, indexX) => {
            if (Cart.isItACart(char)) {
                console.log('Cart fond at', indexX + ',' + indexY)
                let cart = new Cart(indexX, indexY, char);
                track.addCart(cart);
            }
            kartan[indexY][indexX] = char;
        });
    });
    track.addKartan(kartan);

    let cont: boolean = true;
    let returnString: string;
    let numberOfCarts = track.cartsArray.length;
    while (cont) {
        track.removedCrashedCarts();
        let numberCarts = track.cartsArray.length;
        if (numberCarts == 1) {
            //Game over, get cord of cart
            returnString = track.cartsArray[0].xCord + ',' + track.cartsArray[0].yCord;
            return returnString;
        }
        track.sortCarts();
        for (let i = 0; i < numberCarts; i++) {
            track.moveCart(i);
            let numerOfCartsRemaining = track.checkForCrashAndMarkCarts();
        }
    }
    return returnString;
}

function main() {
    TestsForPart1();
    let resultPart1 = partA('PartA');
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
