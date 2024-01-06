export class Color {
    constructor(r = 128, g = 128, b = 128, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toCSSFormat() {
        return `rgba(${this.r},${this.g},${this.b},${this.a / 255})`;
    }
    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}
