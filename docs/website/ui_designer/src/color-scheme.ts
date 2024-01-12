import { Color } from "./color.js";

export class ColorItem {
    backgroundColor: Color = new Color(255, 255, 255, 255);
    foregroundColor: Color = new Color(0,0,0,255);
    borderColor: Color = new Color(0,0,0,128);

}

export class ColorScheme {
    name: string = 'UnnamedScheme';
    items: ColorItem[] = [new ColorItem()];



    serialize(): string {
        return '';
    }

    static deserialize(jsonObject: any) {
        var ret = new ColorScheme();
        if (typeof jsonObject.name === 'string') ret.name = jsonObject.name;
        if (jsonObject.items instanceof Array) {

        }
    }

}