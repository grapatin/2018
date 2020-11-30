import { puzzle1_ex, puzzle1_number_of_test, puzzle1_resultex, puzzle2_ex, puzzle2_number_of_test, puzzle2_resultex } from "./testinput";
import * as fs from 'fs';
import * as util from 'util'
import { defaultMaxListeners } from "stream";
import { WriteOutput } from "./WriteOutput";
const readFile = util.promisify(fs.readFile);

const writeFile = new WriteOutput();

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

enum attacks {
    none,
    fire,
    slashing,
    radiation,
    bludgeoning,
    cold
}

class FightingGroup {
    _units: number;
    _hitPoints: number;
    _weakness: Array<attacks>;
    _immune: Array<attacks>;
    _attack: attacks;
    _damage: number;
    _initiate: number;
    _targetSelected: FightingGroup;
    _selectedAsTargetBy: FightingGroup;
    constructor() {
        this._immune = new Array(1).fill(attacks.none);
        this._weakness = new Array(1).fill(attacks.none);
    }
    set units(unit: number) {
        if ((unit != undefined) && (!isNaN(unit))) {
            this._units = unit;
        }
    }
    set hitPoints(hitP: number) {
        if ((hitP != undefined) && (!isNaN(hitP))) {
            this._hitPoints = +hitP;
        }
    }
    set weakness(value: string | Array<attacks>) {
        if (value != undefined) {
            let inputString = value as string;
            this._weakness.shift();
            if (inputString.includes('fire')) {
                this._weakness.push(attacks.fire);
            }
            if (inputString.includes('slashing')) {
                this._weakness.push(attacks.slashing);
            }
            if (inputString.includes('radiation')) {
                this._weakness.push(attacks.radiation);
            }
            if (inputString.includes('bludgeoning')) {
                this._weakness.push(attacks.bludgeoning);
            }
            if (inputString.includes('cold')) {
                this._weakness.push(attacks.cold);
            }
        }
    }
    set immune(value: string | Array<attacks>) {
        let inputString = value as string;
        if (value != undefined) {
            this._immune.shift();
            if (inputString.includes('fire')) {
                this._immune.push(attacks.fire);
            }
            if (inputString.includes('slashing')) {
                this._immune.push(attacks.slashing);
            }
            if (inputString.includes('radiation')) {
                this._immune.push(attacks.radiation);
            }
            if (inputString.includes('bludgeoning')) {
                this._immune.push(attacks.bludgeoning);
            }
            if (inputString.includes('cold')) {
                this._immune.push(attacks.cold);
            }
        }
    }
    set attack(value: string | attacks) {
        if (value != undefined) {
            switch (value) {
                case 'fire':
                    value = attacks.fire;
                    break;
                case 'slashing':
                    value = attacks.slashing;
                    break;
                case 'radiation':
                    value = attacks.radiation;
                    break;
                case 'bludgeoning':
                    value = attacks.bludgeoning;
                    break;
                case 'cold':
                    value = attacks.cold;
                    break;
                default:
                    throw ('Unsupported attack')
                    break;
            }
            this._attack = value;
        }
    }
    set damage(value: number) {
        if ((value != undefined) && (!isNaN(value))) {
            this._damage = value;
        }
    }
    set initiate(value: number) {
        if ((value != undefined) && (!isNaN(value))) {
            this._initiate = value;
        }
    }

    get weakness(): string | Array<attacks> {
        return this._weakness;
    }

    get immune(): string | Array<attacks> {
        return this._immune;
    }

    get effectivePower(): number {
        return this._damage * this._units;
    }

    get initiate(): number {
        return this._initiate;
    }

    get attack(): string | attacks {
        return this._attack
    }

    get units(): number {
        return this._units;
    }

    get hitPoints(): number {
        return this._hitPoints;
    }
}

function processInput(typeofData: string) {
    let rawInput = inputData(typeofData);
    let tempArray: Array<string>;
    tempArray = rawInput.split('\n\n');
    //First Immune system
    //Second Infection
    const regex: RegExp = /((?<NoUnits>\d+) units|(?<hitPoints>\d+) hit|(?<immune>immune to [ a-z,]+)|(?<weak>weak to [ a-z,]+)|does (?<damage>\d+)|(?<damageType>\S+) damage|(?<intiative>\d+))/g;
    let inputArray: Array<Array<FightingGroup>> = new Array();
    let immuneGroupsString = tempArray[0].split('\n');
    let immuneFightingGoups: Array<FightingGroup> = new Array;
    immuneGroupsString.shift();

    immuneGroupsString.forEach(row => {
        let figthingGroup = new FightingGroup;
        let Immune = row.matchAll(regex);
        for (let result of Immune) {
            let { NoUnits, hitPoints, weak, damage, damageType, intiative, immune } = result.groups;
            figthingGroup.units = +NoUnits;
            figthingGroup.hitPoints = +hitPoints;
            figthingGroup.weakness = weak;
            figthingGroup.damage = +damage;
            figthingGroup.attack = damageType;
            figthingGroup.initiate = +intiative;
            figthingGroup.immune = immune;
        }
        immuneFightingGoups.push(figthingGroup);
    })

    let infectionGroupsString = tempArray[1].split('\n');
    let infectionFightingGoups: Array<FightingGroup> = new Array;
    infectionGroupsString.shift();

    infectionGroupsString.forEach(row => {
        let figthingGroup = new FightingGroup;
        let Immune = row.matchAll(regex);
        for (let result of Immune) {
            let { NoUnits, hitPoints, weak, damage, damageType, intiative, immune } = result.groups;
            figthingGroup.units = +NoUnits;
            figthingGroup.hitPoints = +hitPoints;
            figthingGroup.weakness = weak;
            figthingGroup.damage = +damage;
            figthingGroup.attack = damageType;
            figthingGroup.initiate = +intiative;
            figthingGroup.immune = immune;
        }
        infectionFightingGoups.push(figthingGroup);
    })

    inputArray.push(immuneFightingGoups);
    inputArray.push(infectionFightingGoups);

    return inputArray;
}

class RulesClass {
    _immuneArraySortedAfterEffectivePower: Array<FightingGroup>;
    _infectionArraySortedAfterEffectivePower: Array<FightingGroup>;
    _combinedArraySortedAfterInitiate: Array<FightingGroup>;
    _round = 0;

    constructor(figthingGroupArray: Array<Array<FightingGroup>>) {
        this._immuneArraySortedAfterEffectivePower = this._sortAfterEffectivePower(figthingGroupArray[0]);
        this._infectionArraySortedAfterEffectivePower = this._sortAfterEffectivePower(figthingGroupArray[1]);
        this._combinedArraySortedAfterInitiate = this.sortAfterInitiate(figthingGroupArray[0].concat(figthingGroupArray[1]))
    }

    reSortAfterEffectivePower() {
        this._immuneArraySortedAfterEffectivePower = this._sortAfterEffectivePower(this._immuneArraySortedAfterEffectivePower);
        this._infectionArraySortedAfterEffectivePower = this._sortAfterEffectivePower(this._infectionArraySortedAfterEffectivePower);
    }

    _sortAfterEffectivePower(_array: Array<FightingGroup>) {
        _array.sort((a, b) => {
            if (a.effectivePower < b.effectivePower) {
                return 1;
            } else if (a.effectivePower > b.effectivePower) {
                return -1;
            } else if (a.initiate > b.initiate) {
                return 1;
            } else if (a.initiate < b.initiate) {
                return -1;
            } else {
                return 0;
            }
        })
        return _array;
    }

    sortAfterInitiate(_array: Array<FightingGroup>) {
        _array.sort((a, b) => {
            if (a.initiate < b.initiate) {
                return 1;
            } else if (a.initiate > b.initiate) {
                return -1;
            } else {
                return 0;
            }
        })
        return _array;
    }

    howMuchDamage(attacker: FightingGroup, defender: FightingGroup, logic: boolean): number {
        if ((defender._selectedAsTargetBy != null) && (logic == true)) {
            //Already selected as target by another
            return 0;
        }
        if (defender.units == 0) {
            //unit is dead
            return 0;
        }

        let attackType = attacker.attack as attacks;
        let totalPower = attacker.effectivePower;

        let immune = defender.immune as Array<attacks>;
        if (immune.includes(attackType)) {
            return 0;
        }

        let weakness = defender.weakness as Array<attacks>;
        if (weakness.includes(attackType)) {
            return totalPower * 2;
        }

        return totalPower
    }

    selectTargetForAll() {
        this._immuneArraySortedAfterEffectivePower.forEach(immuneGroup => {
            let maxAttack = 0;
            let maxTotalPower = 0;
            let maxIniative = 0;
            let selectedTarget: FightingGroup = null;
            this._infectionArraySortedAfterEffectivePower.forEach(infectionGroup => {
                let tempAttack = this.howMuchDamage(immuneGroup, infectionGroup, true);
                if (tempAttack > maxAttack) {
                    ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, infectionGroup, maxIniative, selectedTarget));
                } else if ((tempAttack == maxAttack) && (tempAttack > 0)) {
                    if (infectionGroup.effectivePower > maxTotalPower) {
                        ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, infectionGroup, maxIniative, selectedTarget));
                    } else if (infectionGroup.effectivePower == maxTotalPower) {
                        if (infectionGroup.initiate > maxIniative) {
                            ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, infectionGroup, maxIniative, selectedTarget));
                        }
                    }
                }
            })
            if (selectedTarget != null) {
                immuneGroup._targetSelected = selectedTarget;
                selectedTarget._selectedAsTargetBy = immuneGroup;
            }
        })

        this._infectionArraySortedAfterEffectivePower.forEach(infGroup => {
            let maxAttack = 0;
            let maxTotalPower = 0;
            let maxIniative = 0;
            let selectedTarget = null;
            this._immuneArraySortedAfterEffectivePower.forEach(imGroup => {
                let tempAttack = this.howMuchDamage(infGroup, imGroup, true);
                if (tempAttack > maxAttack) {
                    ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, imGroup, maxIniative, selectedTarget));
                } else if ((tempAttack == maxAttack) && (tempAttack > 0)) {
                    if (imGroup.effectivePower > maxTotalPower) {
                        ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, imGroup, maxIniative, selectedTarget));
                    } else if (imGroup.effectivePower == maxTotalPower) {
                        if (imGroup.initiate > maxIniative) {
                            ({ maxAttack, maxTotalPower, maxIniative, selectedTarget } = this.setTarget(maxAttack, tempAttack, maxTotalPower, imGroup, maxIniative, selectedTarget));
                        }
                    }
                }
            })
            if (selectedTarget != null) {
                infGroup._targetSelected = selectedTarget;
                selectedTarget._selectedAsTargetBy = infGroup;
            }
        })
    }

    battleRound() {
        this._combinedArraySortedAfterInitiate.forEach(combatGroup => {
            if ((combatGroup._targetSelected != null) && (combatGroup.units > 0)) {
                let target = combatGroup._targetSelected;
                let unitsKilled = Math.floor(this.howMuchDamage(combatGroup, target, false) / target.hitPoints);
                if (target.units > unitsKilled) {
                    target.units = target.units - unitsKilled;
                } else {
                    target.units = 0;
                }
                target._selectedAsTargetBy = null;
                combatGroup._targetSelected = null;
            }
        })
    }

    BattleOngoing(): boolean {
        let ongoing = false;
        let imm = false;
        let inf = false;
        this._immuneArraySortedAfterEffectivePower.forEach(im => {
            if (im.units > 0) {
                imm = true;
            }
        })

        this._infectionArraySortedAfterEffectivePower.forEach(inn => {
            if (inn.units > 0) {
                inf = true;
            }
        })

        ongoing = imm && inf;

        return ongoing
    }

    private setTarget(maxAttack: number, tempAttack: number, maxTotalPower: number, infectionGroup: FightingGroup, maxIniative: number, selectedTarget: any) {
        maxAttack = tempAttack;
        maxTotalPower = infectionGroup.effectivePower;
        maxIniative = infectionGroup.initiate;
        selectedTarget = infectionGroup;
        return { maxAttack, maxTotalPower, maxIniative, selectedTarget };
    }

    consoleLogState() {
        console.log('\nRound', this._round, '\n');
        this._round++;
        console.log('Immune System:');
        this._immuneArraySortedAfterEffectivePower.forEach(element => {
            if (element.units > 0) {
                console.log('Group X contains', element.units, 'units')
            }
        })
        console.log('Infection:');
        this._infectionArraySortedAfterEffectivePower.forEach(element => {
            if (element.units > 0) {
                console.log('Group X contains', element.units, 'units')
            }
        });
    }
}

function partA(typeOfData: string): number {
    let input: Array<Array<FightingGroup>> = processInput(typeOfData);

    let actor = new RulesClass(input);
    //Sort Immune system and infection into 2 list where groups are sorted after effective power and iniative

    //target selection (each group select 1-0 targets i order of dealt damage, effective power and iniative)
    //Each group can only be attached once

    let cont = true;
    while (cont) {
        actor.selectTargetForAll();
        actor.battleRound();
        //actor.consoleLogState();
        actor.reSortAfterEffectivePower();
        cont = actor.BattleOngoing();
    }

    //Now sort after iniative but for all groups
    //Attack after iniative, dealing effictive power damage (unless imune or weak (2x))
    //Loose whole units (hp*number)
    let units = 0;
    actor._combinedArraySortedAfterInitiate.forEach(group => {
        units = units + group.units;
    })

    return units;
}

function partB(typeOfData: string): number {
    let input: Array<Array<FightingGroup>> = processInput(typeOfData);

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
