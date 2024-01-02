import { assert } from "./assert.js";
import { FontStyle } from "./font-style.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { tinycolor } from "./tinycolor.js";
import { Toast } from "./toast.js";

export class FontStyleCreator {
    static htmlCode: string | null = null;
    popup: PopupWindow = new PopupWindow('./font-style-editor.html');

    constructor(title: string = "Create Font Style") {
        this.popup.title = title;
    }

    private async init() {
        var loadingScreen = new LoadingScreen();
        try {
            await this.popup.load(() => loadingScreen.show());
            const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput');
            const sizeInput = this.popup.contentNode.querySelector('#sizeInput');
            const weightInput = this.popup.contentNode.querySelector('#weightInput');
            const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput');
        
            fontNameInput?.addEventListener('input', this.updatePreview.bind(this));
            sizeInput?.addEventListener('input', this.updatePreview.bind(this));
            weightInput?.addEventListener('input', this.updatePreview.bind(this));
            grayScaleInput?.addEventListener('input', this.updatePreview.bind(this));
            this.updatePreview();
        } finally {
            await loadingScreen.hide();
        }
    }


    private updatePreview() {
        const canvas = this.popup.contentNode.querySelector('#previewCanvas') as HTMLCanvasElement;
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput') as HTMLInputElement;
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput') as HTMLInputElement;
        const weightInput = this.popup.contentNode.querySelector('#weightInput') as HTMLInputElement;
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput') as HTMLInputElement;

        const font = `${weightInput.value} ${sizeInput.value}px ${fontNameInput.value}`;
        const grayScale = parseInt(grayScaleInput.value);

        const previewText = "Lorem ipsum";
        const ctx = canvas.getContext("2d")!!;
        ctx.font = font;
        const measure = ctx.measureText(previewText);

        canvas.setAttribute('width', measure.width.toString() + 'px');
        canvas.setAttribute('height', (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent).toString() + 'px');

        // const color = tinycolor();
        const color = tinycolor(getComputedStyle(canvas).color)!!.setAlpha(0).toHex();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(previewText, 0, measure.actualBoundingBoxAscent);
    }

    private fetchFontStyle() {
        const canvas = this.popup.contentNode.querySelector('#previewCanvas') as HTMLCanvasElement;
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput') as HTMLInputElement;
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput') as HTMLInputElement;
        const weightInput = this.popup.contentNode.querySelector('#weightInput') as HTMLInputElement;
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput') as HTMLInputElement;
        const ctx = canvas.getContext("2d")!!;

        const fontFamily = fontNameInput.value;
        const fontSize = parseInt(sizeInput.value);
        const weight = parseInt(weightInput.value);
        const grayScale = parseInt(grayScaleInput.value);

        assert(fontFamily != "", 'Font Name is empty');
        assert(fontSize > 0, "Unsupported size");
        assert(weight > 0, "Unsupported weight");
        assert(grayScale > 0, "Unsupported gray scale");

        return new FontStyle(
            fontNameInput.value,
            parseInt(sizeInput.value),
            parseInt(weightInput.value),
            parseInt(grayScaleInput.value));

    }

    private waitForCancel() {
        return new Promise(resolve => {
            this.popup.contentNode.querySelector('#cancelBtn')?.addEventListener('click', () => resolve(null));
            this.popup.closeBtn.addEventListener('click', () => resolve(null));
        })
    }

    private waitForConfirm() {
        return new Promise(resolve => {
            this.popup.contentNode.querySelector('#confirmBtn')?.addEventListener('click', () => {
                try {
                    resolve(this.fetchFontStyle());
                }
                catch (error) {
                    if (error instanceof Error) {
                        new Toast(error.message).show();
                    }
                }
            })
        })
    }


    private fillInputs(src: FontStyle) {
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput') as HTMLInputElement;
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput') as HTMLInputElement;
        const weightInput = this.popup.contentNode.querySelector('#weightInput') as HTMLInputElement;
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput') as HTMLInputElement;
        fontNameInput.value = src.family;
        sizeInput.value = src.size.toString();
        weightInput.value = src.weight.toString();
        grayScaleInput.value = src.grayScale.toString();
    }

    async edit(src:FontStyle|null = null): Promise<FontStyle | null> {
        var result: FontStyle | null = null;
        try {
            this.popup.init();
            await this.init();
            this.popup.show();
            if (src) this.fillInputs(src);
            result = await Promise.race([this.waitForCancel(), this.waitForConfirm()]) as FontStyle|null;
        }
        catch (error) {
            if (error instanceof Error) {
                new Toast(error.message).show();
            }
        }
        finally {
            this.popup.hide();
            this.popup.deinit();
            return result;
        }
    }
}
