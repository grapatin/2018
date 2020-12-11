class Ligth {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    moveOneStep() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
//# sourceMappingURL=ligth.js.map