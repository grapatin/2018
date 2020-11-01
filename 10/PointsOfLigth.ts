import { isMaster } from "cluster";
import { Light } from "./light";

export class PointsOfLigth {

    maxX = 0;
    minX = 0;
    maxY = 0;
    minY = 0;
    time = 0;
    stringToPrint: String = '';

    arrayOfLigths: Array<Light> = new Array();
    constructor(inputArray: Array<String>) {
        for (let i = 0; i < inputArray.length; i += 2) {
            let xy = inputArray[i].split(',');
            let vxvy = inputArray[i + 1].split(',');
            let x = +xy[0];
            let y = +xy[1];
            let ligth = new Light(x, y, +vxvy[0], +vxvy[1]);
            this.arrayOfLigths.push(ligth);
        }
    }

    setMinMax() {
        this.maxX = this.arrayOfLigths[0].x;
        this.maxY = this.arrayOfLigths[0].y;
        this.minX = this.arrayOfLigths[0].x;
        this.minY = this.arrayOfLigths[0].y;
        this.arrayOfLigths.forEach(e => {
            if (e.x > this.maxX) {
                this.maxX = e.x;
            }
            if (e.x < this.minX) {
                this.minX = e.x;
            }
            if (e.y > this.maxY) {
                this.maxY = e.y;
            }
            if (e.y < this.minY) {
                this.minY = e.y;
            }
        })
    }

    moveOneStep() {
        this.arrayOfLigths.forEach(element => {
            element.moveOneStep();
        });
        this.time++;
    }

    moveBackOneStep() {
        this.arrayOfLigths.forEach(element => {
            element.moveBackOneStep();
        });
        this.time--;
    }

    replaceAt(index: number, char: string) {
        let a = this.stringToPrint.split('');
        a[index] = char;
        this.stringToPrint = a.join('');
    }

    calculateDistance() {
        //Add the ligth #
        let distance = 0;
        this.arrayOfLigths.forEach(light => {
            distance += Math.abs(light.x) + Math.abs(light.y)
        })
        return distance;
    }
    consoleLogCurrentState() {
        this.stringToPrint = '';
        //Create empty string with ...
        //y number of lines, x number of chars per linx
        this.setMinMax();
        let numberOfLines = 1 + Math.abs(this.minY) + this.maxY;
        let numberOfCharsPerLine = 1 + Math.abs(this.minX) + this.maxX;
        for (let line = 0; line < numberOfLines; line++) {
            for (let char = 0; char < numberOfCharsPerLine; char++) {
                this.stringToPrint += '.'
            }
            this.stringToPrint += '\n';
        }
        //Add the ligth #

        this.arrayOfLigths.forEach(light => {
            //Calculate where to put it +1 for \n
            let position = Math.abs(this.minY - light.y) * (numberOfCharsPerLine + 1) + Math.abs(this.minX - light.x);
            this.replaceAt(position, '#');
        })

        console.log(this.stringToPrint);
    }
}
