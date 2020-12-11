export class Light {
    x: number;
    y: number;
    vx: number;
    vy: number;
    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    moveOneStep() {
        this.x += this.vx;
        this.y += this.vy;
    }

    moveBackOneStep() {
        this.x -= this.vx;
        this.y -= this.vy;
    }
}
