import { ColorScheme } from "./color-scheme.js";
import { ColorSchemeSelector } from "./color-scheme-selector.js";

export class ColorSchemeSelectorButton extends HTMLElement {

    private _value: ColorScheme | null = null;
    private shadow: ShadowRoot;

    get value() { return this._value; }
    set value(value) { this._value = value; this.updatePreview() }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        this.updatePreview();

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
            `
span{
    font-size: inherit;
}
.preview-element{
    font-weight: 500;
    font-size: 12px;
    border: 3px solid;
    padding: 4px 10px;
}
`
        )
        this.shadow.adoptedStyleSheets.push(sheet);

        this.addEventListener("click", async () => {
            const result = await new ColorSchemeSelector().select();
            if (!result) return;
            this.value = result;
        })
    }

    private updatePreview() {
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
            this.shadow.appendChild(span)

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

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(`属性 ${name}s 已变更。`);
    }
}

customElements.define('color-scheme-selector-button', ColorSchemeSelectorButton);