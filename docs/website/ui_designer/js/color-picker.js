var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Color } from "./color.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { tinycolor } from "./tinycolor.js";
import { Toast } from "./toast.js";
import * as Check from "./check.js";
export class ColorPicker {
    constructor(title = 'Pick a Color') {
        this.popup = new PopupWindow('./color-picker.html');
        this.popup.title = title;
    }
    waitForConfirm() {
        return new Promise((resolve, reject) => {
            var _a;
            (_a = this.popup.contentNode.querySelector('#confirmBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                const inputH = this.popup.contentNode.querySelector('#inputH');
                const inputS = this.popup.contentNode.querySelector('#inputS');
                const inputL = this.popup.contentNode.querySelector('#inputL');
                const inputA = this.popup.contentNode.querySelector('#inputA');
                const hslaStr = `hsla(${inputH === null || inputH === void 0 ? void 0 : inputH.value}, ${inputS === null || inputS === void 0 ? void 0 : inputS.value}%, ${inputL === null || inputL === void 0 ? void 0 : inputL.value}%, ${inputA === null || inputA === void 0 ? void 0 : inputA.value})`;
                const rgb = tinycolor(hslaStr).toRgb();
                resolve(new Color(rgb.r, rgb.g, rgb.b, rgb.a * 255));
            });
        });
    }
    waitForCancel() {
        return new Promise((resolve, reject) => {
            var _a;
            this.popup.closeBtn.addEventListener('click', () => resolve(null));
            (_a = this.popup.contentNode.querySelector('#cancelBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => resolve(null));
        });
    }
    waitForResult() {
        return Promise.race([this.waitForCancel(), this.waitForConfirm()]);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var loadingscreen = new LoadingScreen();
            try {
                this.popup.init();
                yield this.popup.load(() => { loadingscreen.show(); });
            }
            finally {
                yield loadingscreen.hide();
            }
        });
    }
    updatePreview() {
        var _a;
        const inputH = this.popup.contentNode.querySelector('#inputH');
        const inputS = this.popup.contentNode.querySelector('#inputS');
        const inputL = this.popup.contentNode.querySelector('#inputL');
        const inputA = this.popup.contentNode.querySelector('#inputA');
        const preview = this.popup.contentNode.querySelector('.preview');
        const hslaStr = `hsla(${inputH === null || inputH === void 0 ? void 0 : inputH.value}, ${inputS === null || inputS === void 0 ? void 0 : inputS.value}%, ${inputL === null || inputL === void 0 ? void 0 : inputL.value}%, ${inputA === null || inputA === void 0 ? void 0 : inputA.value})`;
        const background = `linear-gradient(${hslaStr}, ${hslaStr}),linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 0px 0px / 10px 10px,linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 5px 5px / 10px 10px`;
        preview.style.background = background;
        const color = tinycolor(hslaStr);
        if (color === null || color === void 0 ? void 0 : color.isDark())
            preview.style.color = "#FFF";
        else
            preview.style.color = "#333";
        const rgb = color === null || color === void 0 ? void 0 : color.toRgb();
        const hsl = color === null || color === void 0 ? void 0 : color.toHsl();
        const previewText = `<p>RGB: ${rgb.r},${rgb.b},${rgb.b}</p><p>HSL: ${hsl.h.toFixed(0)},${hsl.s.toFixed(2)},${hsl.l.toFixed(2)}</p><p>Alpha: ${(_a = rgb.a) === null || _a === void 0 ? void 0 : _a.toFixed(2)}</p>`;
        preview.innerHTML = previewText;
    }
    configPreview() {
        const inputH = this.popup.contentNode.querySelector('#inputH');
        const inputS = this.popup.contentNode.querySelector('#inputS');
        const inputL = this.popup.contentNode.querySelector('#inputL');
        const inputA = this.popup.contentNode.querySelector('#inputA');
        inputH === null || inputH === void 0 ? void 0 : inputH.addEventListener('input', () => { this.updatePreview(); });
        inputS === null || inputS === void 0 ? void 0 : inputS.addEventListener('input', () => { this.updatePreview(); });
        inputL === null || inputL === void 0 ? void 0 : inputL.addEventListener('input', () => { this.updatePreview(); });
        inputA === null || inputA === void 0 ? void 0 : inputA.addEventListener('input', () => { this.updatePreview(); });
        this.updatePreview();
    }
    fillInputs(color) {
        var _a;
        const inputH = this.popup.contentNode.querySelector('#inputH');
        const inputS = this.popup.contentNode.querySelector('#inputS');
        const inputL = this.popup.contentNode.querySelector('#inputL');
        const inputA = this.popup.contentNode.querySelector('#inputA');
        const hsla = (_a = tinycolor(color.toCSSFormat())) === null || _a === void 0 ? void 0 : _a.toHsl();
        console.log(hsla);
        inputH.value = hsla.h.toString();
        inputS.value = (hsla.s * 100).toString();
        inputL.value = (hsla.l * 100).toString();
        inputA.value = hsla.a.toString();
    }
    configParse() {
        const inputText = this.popup.contentNode.querySelector('#inputText');
        inputText.addEventListener('input', () => {
            const valid = Check.isColorString(inputText.value);
            if (valid.result == true) {
                inputText.setAttribute('state', 'normal');
            }
            else {
                inputText.setAttribute('state', 'error');
            }
        });
        inputText.addEventListener('change', () => {
            const valid = Check.isColorString(inputText.value);
            if (valid.result != true) {
                const text = inputText.value;
                inputText.value = "";
                inputText.setAttribute('state', 'normal');
                if (text == '')
                    return;
                new Toast(valid.reason).show();
                return;
            }
            const rgba = tinycolor(inputText.value).toRgb();
            this.fillInputs(new Color(rgba.r, rgba.g, rgba.b, rgba.a * 255));
            this.updatePreview();
        });
    }
    pick(color = new Color()) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                yield this.init();
                this.fillInputs(color);
                this.configPreview();
                this.configParse();
                this.popup.show();
                result = yield this.waitForResult();
            }
            catch (e) {
                if (e instanceof Error) {
                    new Toast(e.message).show();
                }
                console.error(e);
            }
            finally {
                this.popup.hide();
                this.popup.deinit();
                console.log(result);
                return result;
            }
        });
    }
}
