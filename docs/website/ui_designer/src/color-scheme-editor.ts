import { assert } from "./assert.js";
import { ColorPicker } from "./color-picker.js";
import { ColorItem, ColorScheme } from "./color-scheme.js";
import { Color } from "./color.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";

type ModeNode = {
    modeTag: HTMLParagraphElement,
    inputNode: HTMLDivElement,
    backgroundInput: { node: HTMLDivElement, value: Color },
    foregroundInput: { node: HTMLDivElement, value: Color },
    borderInput: { node: HTMLDivElement, value: Color }
}

export class ColorSchemeEditor {

    private popup: PopupWindow = new PopupWindow('./color-scheme-editor.html');
    private modes: ModeNode[] = [];


    waitForCancel(): Promise<null> {
        return new Promise((resolve, reject) => {
            const cancelBtn = this.popup.contentNode.querySelector('#cancelBtn');
            cancelBtn?.addEventListener('click', () => resolve(null))
            this.popup.closeBtn.addEventListener('click', () => resolve(null))
        })
    }


    waitForConfirm(): Promise<ColorScheme> {
        return new Promise((resolve, reject) => {
            const confirmBtn = this.popup.contentNode.querySelector('#confirmBtn');
            confirmBtn?.addEventListener('click', () => {

            });
        })
    }

    waitForResult(): Promise<ColorScheme | null> {
        return Promise.race([this.waitForCancel(), this.waitForConfirm()]);
    }

    updatePreview() {
        // console.log(111);
        const backgroundInput = this.popup.contentNode.querySelector('#backgroundInput') as HTMLInputElement;
        const foregroundInput = this.popup.contentNode.querySelector('#foregroundInput') as HTMLInputElement;
        const borderInput = this.popup.contentNode.querySelector('#borderInput') as HTMLInputElement;
        const previewEle = this.popup.contentNode.querySelector('.preview-element') as HTMLSpanElement;

        assert(backgroundInput != null && foregroundInput != null && borderInput != null && previewEle != null);

        previewEle.style.borderColor = borderInput.value;
        previewEle.style.color = foregroundInput.value;
        previewEle.style.backgroundColor = backgroundInput.value;
    }

    private changeMode(mode: ModeNode) {
        const content = this.popup.contentNode.querySelector('.content');
        const modeContainer = content?.querySelector('.mode-container')!!;
        assert(modeContainer != null && modeContainer != void 0);
        const inputArea = content?.querySelector('.input-area');
        inputArea?.remove();
        var modeTags = modeContainer?.querySelectorAll('p');
        modeTags?.forEach(ele => {
            ele.setAttribute('state', 'normal');
        })
        mode.modeTag.setAttribute('state', 'active');
        content?.insertBefore(mode.inputNode, modeContainer);
        console.log(content, modeContainer, inputArea, mode);
    }

    private constructColorPickerTag(name: string, color: Color, previewUpdater: Function) {
        function setPreview(preview: HTMLDivElement, color: Color) {
            const background =
                `linear-gradient(${color.toCSSFormat()}, ${color.toCSSFormat()}),
                linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 0px 0px / 6px 6px,
                linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 3px 3px / 6px 6px`;
            preview.style.background = background
                
        }
        var tag = document.createElement('div');
        var preview = document.createElement('div');
        var nameNode = document.createElement('span');
        tag.className = 'picker';
        nameNode.innerText = name;
        setPreview(preview, color);
        tag.appendChild(preview);
        tag.appendChild(nameNode);
        var ret = {
            node: tag,
            value: color.copy()
        }
        tag.addEventListener('click', async () => {
            var newcolor = await new ColorPicker().pick(ret.value);
            console.log(newcolor);
            if (newcolor) {
                ret.value = newcolor;
                setPreview(preview, newcolor);
                previewUpdater();
            }
        })
        return ret;
    }

    private constructModeNode(item: ColorItem, index: number) {
        // @ts-ignore
        var ret: ModeNode = {};
        ret.inputNode = document.createElement('div');
        ret.inputNode.className = 'input-area';
        var previewNode = document.createElement('span');
        var inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        var previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        previewNode.innerText = 'Text';
        previewNode.className = 'preview-element';
        ret.inputNode.appendChild(previewNode);
        var previewUpdater = () => {
            previewNode.style.backgroundColor = ret.backgroundInput.value.toCSSFormat();
            previewNode.style.color = ret.foregroundInput.value.toCSSFormat();
            previewNode.style.borderColor = ret.borderInput.value.toCSSFormat();
        }
        ret.backgroundInput = this.constructColorPickerTag("Background", item.backgroundColor, previewUpdater);
        ret.foregroundInput = this.constructColorPickerTag("Foreground", item.foregroundColor, previewUpdater);
        ret.borderInput = this.constructColorPickerTag("Border", item.borderColor, previewUpdater);
        previewUpdater();
        previewContainer.appendChild(previewNode);
        inputContainer.appendChild(ret.backgroundInput.node);
        inputContainer.appendChild(ret.foregroundInput.node);
        inputContainer.appendChild(ret.borderInput.node);
        ret.inputNode.appendChild(previewContainer);
        ret.inputNode.appendChild(inputContainer)
        ret.modeTag = document.createElement("p");
        ret.modeTag.innerText = `Mode ${index + 1}`;
        ret.modeTag.addEventListener('click', () => { this.changeMode(ret) })
        return ret;
    }

    private constructView(scheme: ColorScheme) {
        const modeContainer = this.popup.contentNode.querySelector('.mode-container');
        scheme.items.forEach((item, index) => {
            var mode = this.constructModeNode(item, index)
            modeContainer?.appendChild(mode.modeTag);
            this.modes.push(mode);
        })
        this.changeMode(this.modes[0]);
    }


    async init() {
        const loadingScreen = new LoadingScreen();
        try {
            this.popup.init();
            await this.popup.load(() => loadingScreen.show());


            // backgroundInput?.addEventListener('input', () => console.log(backgroundInput.value))


        }
        finally {
            await loadingScreen.hide()
        }
    }

    async edit(scheme: ColorScheme = new ColorScheme()): Promise<ColorScheme | null> {
        var result: ColorScheme | null = null;
        try {
            await this.init();
            this.constructView(scheme);
            this.popup.show();
            result = await this.waitForResult();
        }
        catch (error) {
            if (error instanceof Error) {
                new Toast(error.message).show();
            }
            console.error(error);
        }
        finally {
            this.popup.hide();
            this.popup.deinit();
            return result;
        }

    }
};