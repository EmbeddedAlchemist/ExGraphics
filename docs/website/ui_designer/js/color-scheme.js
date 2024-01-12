import { Color } from "./color.js";
export class ColorItem {
    constructor() {
        this.backgroundColor = new Color(255, 255, 255, 255);
        this.foregroundColor = new Color(0, 0, 0, 255);
        this.borderColor = new Color(0, 0, 0, 128);
    }
}
export class ColorScheme {
    constructor() {
        this.name = 'UnnamedScheme';
        this.items = [new ColorItem()];
    }
    serialize() {
        return '';
    }
    static deserialize(jsonObject) {
        var ret = new ColorScheme();
        if (typeof jsonObject.name === 'string')
            ret.name = jsonObject.name;
        if (jsonObject.items instanceof Array) {
        }
    }
}
