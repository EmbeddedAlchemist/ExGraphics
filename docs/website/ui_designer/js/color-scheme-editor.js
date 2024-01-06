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
import { ColorPicker } from "./color-picker.js";
import { ColorScheme } from "./color-scheme.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";
export class ColorSchemeEditor {
    constructor() {
        this.popup = new PopupWindow('./color-scheme-editor.html');
        this.modes = [];
    }
    waitForCancel() {
        return new Promise((resolve, reject) => {
            const cancelBtn = this.popup.contentNode.querySelector('#cancelBtn');
            cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', () => resolve(null));
            this.popup.closeBtn.addEventListener('click', () => resolve(null));
        });
    }
    waitForConfirm() {
        return new Promise((resolve, reject) => {
            const confirmBtn = this.popup.contentNode.querySelector('#confirmBtn');
            confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener('click', () => {
            });
        });
    }
    waitForResult() {
        return Promise.race([this.waitForCancel(), this.waitForConfirm()]);
    }
    updatePreview() {
        const backgroundInput = this.popup.contentNode.querySelector('#backgroundInput');
        const foregroundInput = this.popup.contentNode.querySelector('#foregroundInput');
        const borderInput = this.popup.contentNode.querySelector('#borderInput');
        const previewEle = this.popup.contentNode.querySelector('.preview-element');
        assert(backgroundInput != null && foregroundInput != null && borderInput != null && previewEle != null);
        previewEle.style.borderColor = borderInput.value;
        previewEle.style.color = foregroundInput.value;
        previewEle.style.backgroundColor = backgroundInput.value;
    }
    changeMode(mode) {
        const content = this.popup.contentNode.querySelector('.content');
        const modeContainer = content === null || content === void 0 ? void 0 : content.querySelector('.mode-container');
        assert(modeContainer != null && modeContainer != void 0);
        const inputArea = content === null || content === void 0 ? void 0 : content.querySelector('.input-area');
        inputArea === null || inputArea === void 0 ? void 0 : inputArea.remove();
        var modeTags = modeContainer === null || modeContainer === void 0 ? void 0 : modeContainer.querySelectorAll('p');
        modeTags === null || modeTags === void 0 ? void 0 : modeTags.forEach(ele => {
            ele.setAttribute('state', 'normal');
        });
        mode.modeTag.setAttribute('state', 'active');
        content === null || content === void 0 ? void 0 : content.insertBefore(mode.inputNode, modeContainer);
        console.log(content, modeContainer, inputArea, mode);
    }
    constructColorPickerTag(name, color, previewUpdater) {
        function setPreview(preview, color) {
            const background = `linear-gradient(${color.toCSSFormat()}, ${color.toCSSFormat()}),
                linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 0px 0px / 6px 6px,
                linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 3px 3px / 6px 6px`;
            preview.style.background = background;
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
        };
        tag.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var newcolor = yield new ColorPicker().pick(ret.value);
            console.log(newcolor);
            if (newcolor) {
                ret.value = newcolor;
                setPreview(preview, newcolor);
                previewUpdater();
            }
        }));
        return ret;
    }
    constructModeNode(item, index) {
        var ret = {};
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
        };
        ret.backgroundInput = this.constructColorPickerTag("Background", item.backgroundColor, previewUpdater);
        ret.foregroundInput = this.constructColorPickerTag("Foreground", item.foregroundColor, previewUpdater);
        ret.borderInput = this.constructColorPickerTag("Border", item.borderColor, previewUpdater);
        previewUpdater();
        previewContainer.appendChild(previewNode);
        inputContainer.appendChild(ret.backgroundInput.node);
        inputContainer.appendChild(ret.foregroundInput.node);
        inputContainer.appendChild(ret.borderInput.node);
        ret.inputNode.appendChild(previewContainer);
        ret.inputNode.appendChild(inputContainer);
        ret.modeTag = document.createElement("p");
        ret.modeTag.innerText = `Mode ${index + 1}`;
        ret.modeTag.addEventListener('click', () => { this.changeMode(ret); });
        return ret;
    }
    constructView(scheme) {
        const modeContainer = this.popup.contentNode.querySelector('.mode-container');
        scheme.items.forEach((item, index) => {
            var mode = this.constructModeNode(item, index);
            modeContainer === null || modeContainer === void 0 ? void 0 : modeContainer.appendChild(mode.modeTag);
            this.modes.push(mode);
        });
        this.changeMode(this.modes[0]);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const loadingScreen = new LoadingScreen();
            try {
                this.popup.init();
                yield this.popup.load(() => loadingScreen.show());
            }
            finally {
                yield loadingScreen.hide();
            }
        });
    }
    edit(scheme = new ColorScheme()) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                yield this.init();
                this.constructView(scheme);
                this.popup.show();
                result = yield this.waitForResult();
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
        });
    }
}
;
