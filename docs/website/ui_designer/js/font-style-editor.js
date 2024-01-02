var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "./assert.js";
import { FontStyle } from "./font-style.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { tinycolor } from "./tinycolor.js";
import { Toast } from "./toast.js";
export class FontStyleCreator {
    constructor(title = "Create Font Style") {
        this.popup = new PopupWindow('./font-style-editor.html');
        this.popup.title = title;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var loadingScreen = new LoadingScreen();
            try {
                yield this.popup.load(() => loadingScreen.show());
                const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput');
                const sizeInput = this.popup.contentNode.querySelector('#sizeInput');
                const weightInput = this.popup.contentNode.querySelector('#weightInput');
                const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput');
                fontNameInput === null || fontNameInput === void 0 ? void 0 : fontNameInput.addEventListener('input', this.updatePreview.bind(this));
                sizeInput === null || sizeInput === void 0 ? void 0 : sizeInput.addEventListener('input', this.updatePreview.bind(this));
                weightInput === null || weightInput === void 0 ? void 0 : weightInput.addEventListener('input', this.updatePreview.bind(this));
                grayScaleInput === null || grayScaleInput === void 0 ? void 0 : grayScaleInput.addEventListener('input', this.updatePreview.bind(this));
                this.updatePreview();
            }
            finally {
                yield loadingScreen.hide();
            }
        });
    }
    updatePreview() {
        const canvas = this.popup.contentNode.querySelector('#previewCanvas');
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput');
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput');
        const weightInput = this.popup.contentNode.querySelector('#weightInput');
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput');
        const font = `${weightInput.value} ${sizeInput.value}px ${fontNameInput.value}`;
        const grayScale = parseInt(grayScaleInput.value);
        const previewText = "Lorem ipsum";
        const ctx = canvas.getContext("2d");
        ctx.font = font;
        const measure = ctx.measureText(previewText);
        canvas.setAttribute('width', measure.width.toString() + 'px');
        canvas.setAttribute('height', (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent).toString() + 'px');
        const color = tinycolor(getComputedStyle(canvas).color).setAlpha(0).toHex();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(previewText, 0, measure.actualBoundingBoxAscent);
    }
    fetchFontStyle() {
        const canvas = this.popup.contentNode.querySelector('#previewCanvas');
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput');
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput');
        const weightInput = this.popup.contentNode.querySelector('#weightInput');
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput');
        const ctx = canvas.getContext("2d");
        const fontFamily = fontNameInput.value;
        const fontSize = parseInt(sizeInput.value);
        const weight = parseInt(weightInput.value);
        const grayScale = parseInt(grayScaleInput.value);
        assert(fontFamily != "", 'Font Name is empty');
        assert(fontSize > 0, "Unsupported size");
        assert(weight > 0, "Unsupported weight");
        assert(grayScale > 0, "Unsupported gray scale");
        return new FontStyle(fontNameInput.value, parseInt(sizeInput.value), parseInt(weightInput.value), parseInt(grayScaleInput.value));
    }
    waitForCancel() {
        return new Promise(resolve => {
            var _a;
            (_a = this.popup.contentNode.querySelector('#cancelBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => resolve(null));
            this.popup.closeBtn.addEventListener('click', () => resolve(null));
        });
    }
    waitForConfirm() {
        return new Promise(resolve => {
            var _a;
            (_a = this.popup.contentNode.querySelector('#confirmBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                try {
                    resolve(this.fetchFontStyle());
                }
                catch (error) {
                    if (error instanceof Error) {
                        new Toast(error.message).show();
                    }
                }
            });
        });
    }
    fillInputs(src) {
        const fontNameInput = this.popup.contentNode.querySelector('#fontNameInput');
        const sizeInput = this.popup.contentNode.querySelector('#sizeInput');
        const weightInput = this.popup.contentNode.querySelector('#weightInput');
        const grayScaleInput = this.popup.contentNode.querySelector('#grayScaleInput');
        fontNameInput.value = src.family;
        sizeInput.value = src.size.toString();
        weightInput.value = src.weight.toString();
        grayScaleInput.value = src.grayScale.toString();
    }
    edit(src = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                this.popup.init();
                yield this.init();
                this.popup.show();
                if (src)
                    this.fillInputs(src);
                result = (yield Promise.race([this.waitForCancel(), this.waitForConfirm()]));
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
        });
    }
}
FontStyleCreator.htmlCode = null;
