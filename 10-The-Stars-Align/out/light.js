"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Light = void 0;
class Light {
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
    moveBackOneStep() {
        this.x -= this.vx;
        this.y -= this.vy;
    }
}
exports.Light = Light;
//# sourceMappingURL=light.js.map