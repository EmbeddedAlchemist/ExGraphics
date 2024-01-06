import { FontStyle } from "./font-style";
import { ColorScheme } from "./color-scheme";

export class Style{
    name: string = 'UnnanedStyle';
    font: FontStyle = new FontStyle("Unknown");
    ColorScheme: ColorScheme = new ColorScheme();

    constructor() {
        
    }


    serialize(): string { 
        return ''
    }

    deserialize(json: string): Style{
        var ret = new Style();
        return ret;
    }

}