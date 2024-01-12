var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ColorSchemeSelector } from "./color-scheme-selector.js";
export class ColorSchemeSelectorButton extends HTMLElement {
    get value() { return this._value; }
    set value(value) { this._value = value; this.updatePreview(); }
    constructor() {
        super();
        this._value = null;
        this.shadow = this.attachShadow({ mode: "closed" });
        this.updatePreview();
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
span{
    font-size: inherit;
}
.preview-element{
    font-weight: 500;
    font-size: 12px;
    border: 3px solid;
    padding: 4px 10px;
}
`);
        this.shadow.adoptedStyleSheets.push(sheet);
        this.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const result = yield new ColorSchemeSelector().select();
            if (!result)
                return;
            this.value = result;
        }));
    }
    updatePreview() {
        this.shadow.innerHTML = '';
        if (this._value) {
            var span = document.createElement("span");
            span.textContent = 'Text';
            span.className = 'preview-element';
            span.style.backgroundColor = this._value.items[0].backgroundColor.toCSSFormat();
            span.style.color = this._value.items[0].foregroundColor.toCSSFormat();
            span.style.borderColor = this._value.items[0].borderColor.toCSSFormat();
            this.shadow.appendChild(span);
        }
        else {
            var span = document.createElement("span");
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
customElements.define('color-scheme-selector-button', ColorSchemeSelectorButton);
