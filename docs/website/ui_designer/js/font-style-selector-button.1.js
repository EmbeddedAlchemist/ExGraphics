var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FontStyleSelector } from "./font-style-selector.js";
export class FontStyleSelectorButton extends HTMLElement {
    constructor() {
        super();
        this._value = null;
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.updatePreview();
        this.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield new FontStyleSelector().select();
            if (result)
                this.value = result;
        }));
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
:root{
    display: flex;
    align-items: center;
    justify-content: center;
}
span{
    font-size: inherit;
}
`);
        this.shadow.adoptedStyleSheets = [sheet];
    }
    get value() {
        return this._value;
    }
    set value(font) {
        this._value = font;
        this.updatePreview();
    }
    updatePreview() {
        var _a;
        this.shadow.innerHTML = '';
        if (this._value) {
            var canvas = document.createElement('canvas');
            canvas.width = this._value.previewImage.width;
            canvas.height = this._value.previewImage.height;
            (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.putImageData(this._value.previewImage, 0, 0);
            this.shadow.appendChild(canvas);
        }
        else {
            var span = document.createElement('span');
            span.textContent = 'Select';
            this.shadow.appendChild(span);
        }
    }
    connectedCallback() {
        console.log("自定义元素添加至页面。");
    }
    disconnectedCallback() {
        console.log("自定义元素从页面中移除。");
    }
    adoptedCallback() {
        console.log("自定义元素移动至新页面。");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`属性 ${name}s 已变更。`);
    }
}
customElements.define('font-style-selector-button', FontStyleSelectorButton);
