import { FontStyle } from "./font-style";
import { FontStyleSelector } from "./font-style-selector.js";

export class FontStyleSelectorButton extends HTMLElement {
    private _value: FontStyle | null = null;
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.updatePreview();
        this.addEventListener('click', async () => {
            const result = await new FontStyleSelector().select();
            if (result)
                this.value = result;
        })

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(
`
span{
    font-size: inherit;
}
`
        )
        this.shadow.adoptedStyleSheets.push(sheet);
    }

    get value(): FontStyle | null {
        return this._value;
    }

    set value(font: FontStyle | null) {
        this._value = font;
        this.updatePreview();
    }

    updatePreview() {
        this.shadow.innerHTML = ''
        if (this._value) {
            var canvas = document.createElement('canvas');
            canvas.width = this._value.previewImage.width;
            canvas.height = this._value.previewImage.height;
            canvas.getContext('2d')?.putImageData(this._value.previewImage, 0, 0);
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

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(`属性 ${name}s 已变更。`);
    }
}

customElements.define('font-style-selector-button', FontStyleSelectorButton);