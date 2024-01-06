import { FontStyle } from "./font-style";
import { ColorScheme } from "./color-scheme";
export class Style {
    constructor() {
        this.name = 'UnnanedStyle';
        this.font = new FontStyle("Unknown");
        this.ColorScheme = new ColorScheme();
    }
    serialize() {
        return '';
    }
    deserialize(json) {
        var ret = new Style();
        return ret;
    }
}
