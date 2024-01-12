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
import { ColorItem, ColorScheme } from "./color-scheme.js";
import { IconButtonConstructor } from "./icon-button.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { SVGConstructor } from "./svg-constructor.js";
import { Toast } from "./toast.js";
const deleteIconSVGCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
export class ColorSchemeEditor {
    constructor() {
        this.popup = new PopupWindow('./color-scheme-editor.html');
        this.modes = [];
        this.popup.title = 'Edit Color Scheme';
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
            const nameInput = this.popup.contentNode.querySelector('#nameInput');
            confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener('click', () => {
                var items = [];
                this.modes.forEach(ele => {
                    var i = new ColorItem();
                    i.backgroundColor = ele.backgroundInput.value;
                    i.foregroundColor = ele.foregroundInput.value;
                    i.borderColor = ele.borderInput.value;
                    items.push(i);
                });
                var result = new ColorScheme();
                result.items = items;
                result.name = nameInput.value;
                resolve(result);
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
            if (newcolor) {
                ret.value = newcolor;
                setPreview(preview, newcolor);
                previewUpdater();
            }
        }));
        return ret;
    }
    deleteMode(mode) {
        const modeContainer = this.popup.contentNode.querySelector('.mode-container');
        modeContainer === null || modeContainer === void 0 ? void 0 : modeContainer.removeChild(mode.modeTag);
        const indexOfMode = this.modes.indexOf(mode);
        const preIndex = indexOfMode < 0 ? 0 : indexOfMode - 1;
        if (mode.modeTag.getAttribute('state') == 'active')
            this.changeMode(this.modes[preIndex]);
        this.modes.splice(indexOfMode, 1);
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
        var text = document.createElement("span");
        text.innerText = `Mode ${index}`;
        ret.modeTag.appendChild(text);
        if (index != 0) {
            var deleteBtn = IconButtonConstructor('Delete', SVGConstructor(deleteIconSVGCode));
            ret.modeTag.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', (e) => { this.deleteMode(ret); e.stopPropagation(); });
        }
        ret.modeTag.addEventListener('click', () => { this.changeMode(ret); });
        return ret;
    }
    addMode(item, index) {
        const addBtn = this.popup.contentNode.querySelector('#addBtn');
        const modeContainer = this.popup.contentNode.querySelector('.mode-container');
        var mode = this.constructModeNode(item, index);
        modeContainer === null || modeContainer === void 0 ? void 0 : modeContainer.insertBefore(mode.modeTag, addBtn);
        this.modes.push(mode);
    }
    constructView(scheme) {
        const addBtn = this.popup.contentNode.querySelector('#addBtn');
        const nameInput = this.popup.contentNode.querySelector('#nameInput');
        scheme.items.forEach((item, index) => {
            this.addMode(item, index);
        });
        this.changeMode(this.modes[0]);
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
            this.addMode(new ColorItem(), this.modes.length);
        });
        nameInput.value = scheme.name;
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
