import { Color } from "./color.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { tinycolor } from "./tinycolor.js";
import { Toast } from "./toast.js";
import * as Check from "./check.js";

export class ColorPicker {
    private popup: PopupWindow = new PopupWindow('./color-picker.html');

    constructor(title: string = 'Pick a Color') {
        this.popup.title = title;
    }

    waitForConfirm(): Promise<Color> {
        return new Promise<Color>((resolve, reject) => {
            this.popup.contentNode.querySelector('#confirmBtn')?.addEventListener('click', () => {
                const inputH = this.popup.contentNode.querySelector('#inputH') as HTMLInputElement;
                const inputS = this.popup.contentNode.querySelector('#inputS') as HTMLInputElement;
                const inputL = this.popup.contentNode.querySelector('#inputL') as HTMLInputElement;
                const inputA = this.popup.contentNode.querySelector('#inputA') as HTMLInputElement;
                const hslaStr = `hsla(${inputH?.value}, ${inputS?.value}%, ${inputL?.value}%, ${inputA?.value})`
                const rgb = tinycolor(hslaStr)!!.toRgb();
                resolve(new Color(rgb.r, rgb.g, rgb.b, rgb.a!! * 255));
            });
        });
    }

    waitForCancel(): Promise<null> {
        return new Promise<null>((resolve, reject) => {
            this.popup.closeBtn.addEventListener('click', () => resolve(null));
            this.popup.contentNode.querySelector('#cancelBtn')?.addEventListener('click', () => resolve(null));
        });
    }

    waitForResult(): Promise<Color | null> {
        return Promise.race([this.waitForCancel(), this.waitForConfirm()])
    }

    private async init() {
        var loadingscreen = new LoadingScreen()
        try {
            this.popup.init();
            await this.popup.load(() => { loadingscreen.show() });
        }
        finally {
            await loadingscreen.hide();
        }

    }

    private updatePreview() {
        const inputH = this.popup.contentNode.querySelector('#inputH') as HTMLInputElement
        const inputS = this.popup.contentNode.querySelector('#inputS') as HTMLInputElement
        const inputL = this.popup.contentNode.querySelector('#inputL') as HTMLInputElement
        const inputA = this.popup.contentNode.querySelector('#inputA') as HTMLInputElement
        const preview = this.popup.contentNode.querySelector('.preview') as HTMLDivElement | null;
        const hslaStr = `hsla(${inputH?.value}, ${inputS?.value}%, ${inputL?.value}%, ${inputA?.value})`
        const background =
            `linear-gradient(${hslaStr}, ${hslaStr}),linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 0px 0px / 10px 10px,linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 5px 5px / 10px 10px`;
        preview!!.style.background = background;
        // console.log(hsla);
        const color = tinycolor(hslaStr);
        if (color?.isDark())
            preview!!.style.color = "#FFF";
        else
            preview!!.style.color = "#333";

        const rgb = color?.toRgb()!!;
        const hsl = color?.toHsl()!!;
        const previewText =
            `<p>RGB: ${rgb.r},${rgb.b},${rgb.b}</p><p>HSL: ${hsl.h.toFixed(0)},${hsl.s.toFixed(2)},${hsl.l.toFixed(2)}</p><p>Alpha: ${rgb.a?.toFixed(2)}</p>`
        preview!!.innerHTML = previewText;
    }

    private configPreview() {
        const inputH = this.popup.contentNode.querySelector('#inputH') as HTMLInputElement | null;
        const inputS = this.popup.contentNode.querySelector('#inputS') as HTMLInputElement | null;
        const inputL = this.popup.contentNode.querySelector('#inputL') as HTMLInputElement | null;
        const inputA = this.popup.contentNode.querySelector('#inputA') as HTMLInputElement | null;



        inputH?.addEventListener('input', () => { this.updatePreview(); })
        inputS?.addEventListener('input', () => { this.updatePreview(); })
        inputL?.addEventListener('input', () => { this.updatePreview(); })
        inputA?.addEventListener('input', () => { this.updatePreview(); })
        this.updatePreview();

    }

    fillInputs(color: Color) {
        const inputH = this.popup.contentNode.querySelector('#inputH') as HTMLInputElement;
        const inputS = this.popup.contentNode.querySelector('#inputS') as HTMLInputElement;
        const inputL = this.popup.contentNode.querySelector('#inputL') as HTMLInputElement;
        const inputA = this.popup.contentNode.querySelector('#inputA') as HTMLInputElement;
        const hsla = tinycolor(color.toCSSFormat())?.toHsl()!!;
        console.log(hsla)
        inputH.value = hsla.h.toString();
        inputS.value = (hsla.s * 100).toString();
        inputL.value = (hsla.l * 100).toString();
        inputA.value = hsla.a!!.toString();
    }

    private configParse() {
        const inputText = this.popup.contentNode.querySelector('#inputText') as HTMLInputElement;
        inputText.addEventListener('input', () => {
            const valid = Check.isColorString(inputText.value)
            if (valid.result == true) {
                inputText.setAttribute('state', 'normal');
            }
            else {
                inputText.setAttribute('state', 'error');
            }
        })
        inputText.addEventListener('change', () => {
            const valid = Check.isColorString(inputText.value);
            if (valid.result != true) {
                const text = inputText.value;
                inputText.value = "";
                inputText.setAttribute('state', 'normal');
                if (text == '') return;
                new Toast(valid.reason).show();
                return;
            }
            const rgba = tinycolor(inputText.value)!!.toRgb()!!;
            this.fillInputs(new Color(rgba.r, rgba.g, rgba.b, rgba.a!!*255));
            this.updatePreview();
        })
    }

    async pick(color: Color = new Color()) {
        var result: Color | null = null;
        try {
            await this.init();
            this.fillInputs(color);
            this.configPreview();
            this.configParse();
            this.popup.show();
            result = await this.waitForResult();
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

    }
}