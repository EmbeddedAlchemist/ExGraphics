export class Color{
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number = 128, g: number = 128, b: number = 128, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toCSSFormat():string {
        return `rgba(${this.r},${this.g},${this.b},${this.a/255})` ;
    }

    copy(): Color{
        return new Color(this.r, this.g, this.b, this.a);
    }
}