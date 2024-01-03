export class FontStyle {
    generatePreviewImageData() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
    constructor(family, size = 16, weight = 500, grayScale = 2) {
        this.family = family.trim();
        this.size = size;
        this.weight = weight;
        this.grayScale = grayScale;
        this.previewImage = this.generatePreviewImageData();
    }
    serialize() {
        const data = {
            family: this.family,
            size: this.size,
            weight: this.weight,
            grayScale: this.grayScale
        };
        return JSON.stringify(data);
    }
    deserialize(json) {
        const result = JSON.parse(json);
        return new FontStyle(result.family, result.size, result.weight, result.grayScale);
    }
    toCSSFormat() {
        return `${this.weight} ${this.size}px ${this.family}`;
    }
    equals(other) {
        return (this.family === other.family &&
            this.size === other.size &&
            this.weight === other.weight &&
            this.grayScale === other.grayScale);
    }
}
