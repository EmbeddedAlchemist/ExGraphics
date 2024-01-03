import { tinycolor } from "./tinycolor";

export class FontStyle {
    family: string;
    size: number;
    weight: number;
    grayScale: number

    previewImage: ImageData;

    private generatePreviewImageData(): ImageData {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!!;
        ctx.font = this.toCSSFormat();
        const previewText = this.family;
        const measure = ctx.measureText(previewText);
        canvas.setAttribute('width', measure.width.toString() + 'px');
        canvas.setAttribute('height', (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent).toString() + 'px');
        ctx.fillStyle = '#FF0000';
        ctx.font = this.toCSSFormat();
        ctx.fillText(previewText, 0, measure.actualBoundingBoxAscent);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    constructor(family: string, size: number = 16, weight: number = 500, grayScale: number = 2) {
        this.family = family.trim();
        this.size = size;
        this.weight = weight;
        this.grayScale = grayScale;
        this.previewImage = this.generatePreviewImageData();
    }

    serialize(): string {
        const data = {
            family: this.family,
            size: this.size,
            weight: this.weight,
            grayScale: this.grayScale
        };
        return JSON.stringify(data);
    }

    deserialize(json: string): FontStyle {
        const result = JSON.parse(json);
        return new FontStyle(result.family, result.size, result.weight, result.grayScale);
    }

    toCSSFormat(): string {
        return `${this.weight} ${this.size}px ${this.family}`;
    }

    equals(other: FontStyle): boolean {
        return (
            this.family === other.family &&
            this.size === other.size &&
            this.weight === other.weight &&
            this.grayScale === other.grayScale
        );
    }

}