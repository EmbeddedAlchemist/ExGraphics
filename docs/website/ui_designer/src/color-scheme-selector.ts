import { assert } from "./assert.js";
import { ColorSchemeEditor } from "./color-scheme-editor.js";
import { ColorScheme } from "./color-scheme.js";
import { IconButtonConstructor } from "./icon-button.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { SVGConstructor } from "./svg-constructor.js";
import { Toast } from "./toast.js";

type Selection = {
    cardNode: HTMLDivElement,
    value: ColorScheme
}

const editIconSVGCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>';
const deleteIconSVGCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'
const addIconSVGCode = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M466-466H252v-28h214v-214h28v214h214v28H494v214h-28v-214Z"/></svg>';

export class ColorSchemeSelector {

    private listOfSchemes: ColorScheme[];
    private allowEdit: boolean;
    private popup: PopupWindow = new PopupWindow('./color-scheme-selector.html');

    get schemeList() { return this.listOfSchemes };

    constructor(listOfSchemes: ColorScheme[] = [], allowEdit = true) {
        this.listOfSchemes = listOfSchemes;
        this.allowEdit = allowEdit;
        this.popup.title = 'Select a Scheme';
    }

    async init() {
        var loadingScreen = new LoadingScreen();
        try {
            this.popup.init();
            await this.popup.load(() => { loadingScreen.show() });
        }
        finally {
            loadingScreen.hide();
        }
    }


    deleteSelection(sel: Selection) {
        const container = this.popup.contentNode.querySelector('.color-scheme-selector')!!;
        this.listOfSchemes.splice(this.listOfSchemes.indexOf(sel.value), 1);
        container.removeChild(sel.cardNode);
    }

    async editSelection(sel: Selection, resolve: (value: ColorScheme | PromiseLike<ColorScheme>) => void) {
        const result = await new ColorSchemeEditor().edit(sel.value);
        if (!result) return;
        this.deleteSelection(sel);
        const card = this.constructSelection(result, resolve);
        const container = this.popup.contentNode.querySelector('.color-scheme-selector')!!;
        const firstSelection = this.popup.contentNode.querySelector('.item.card');
        container.insertBefore(card.cardNode, firstSelection);

    }

    async addSelection(resolve: (value: ColorScheme | PromiseLike<ColorScheme>) => void) {
        const result = await new ColorSchemeEditor().edit();
        if (!result) return;
        this.listOfSchemes.unshift(result)
        const node = this.constructSelection(result, resolve).cardNode;
        const container = this.popup.contentNode.querySelector('.color-scheme-selector')!!;
        const firstSelection = this.popup.contentNode.querySelector('.item.card');
        container.insertBefore(node, firstSelection);
    }


    constructSelection(scheme: ColorScheme, resolve: (value: ColorScheme | PromiseLike<ColorScheme>) => void): Selection {
        var card = document.createElement('div');
        card.className = 'item card';
        var previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container';
        var previewElement = document.createElement('span');
        previewElement.className = 'preview-element';
        previewElement.innerText = 'text';
        previewElement.style.background =
            `linear-gradient(${scheme.items[0].backgroundColor.toCSSFormat()}, ${scheme.items[0].backgroundColor.toCSSFormat()}),
        linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 0px 0px / 6px 6px,
        linear-gradient(45deg, rgba(var(--text-color-rgb), .4) 25%, transparent 0, transparent 75%, rgba(var(--text-color-rgb), .4) 0) 3px 3px / 6px 6px`;
        previewElement.style.color = scheme.items[0].foregroundColor.toCSSFormat();
        previewElement.style.borderColor = scheme.items[0].borderColor.toCSSFormat();
        var infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
        var mainInfo = document.createElement('span');
        mainInfo.className = 'main-info';
        mainInfo.innerText = scheme.name;
        var subInfo = document.createElement('span');
        subInfo.className = 'sub-info';
        subInfo.innerText = `${scheme.items.length} Mode`;

        previewContainer.appendChild(previewElement);
        infoContainer.appendChild(mainInfo);
        infoContainer.appendChild(subInfo);
        card.appendChild(previewContainer);
        card.appendChild(infoContainer);

        card.addEventListener('click', e => {
            resolve(scheme);
        })

        var result: Selection = {
            cardNode: card,
            value: scheme
        }

        if (this.allowEdit) {
            var editBtn = IconButtonConstructor('Edit', SVGConstructor(editIconSVGCode));
            var deleteBtn = IconButtonConstructor('Delete', SVGConstructor(deleteIconSVGCode));
            editBtn.className += ' edit-btn';
            deleteBtn.className += ' delete-btn';
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);

            editBtn.addEventListener('click', (e) => {
                this.editSelection(result, resolve);
                e.stopPropagation();
            })

            deleteBtn.addEventListener('click', (e) => {
                this.deleteSelection(result);
                e.stopPropagation();
            })
        }
        return result;
    }

    constructAddCard() {
        const addIcon = SVGConstructor(addIconSVGCode);
        var res = document.createElement('div');
        var txt = document.createElement('span');
        txt.innerText = 'Add';
        res.className = 'item add-btn';
        res.appendChild(addIcon);
        res.appendChild(txt);
        return res;
    }

    waitForCancel() {
        return new Promise<null>((resolve, reject) => {
            this.popup.closeBtn.addEventListener('click', (e) => {
                resolve(null)
            })
        })
    }



    waitForSelect() {
        return new Promise<ColorScheme>((resolve, reject) => {
            const container = this.popup.contentNode.querySelector('.color-scheme-selector')!!;
            assert(container != null);
            const addCard = this.constructAddCard();
            if (this.allowEdit) container.appendChild(addCard);
            addCard.addEventListener('click', () => { this.addSelection(resolve)})
            this.listOfSchemes.forEach((scheme) => {
                const sel = this.constructSelection(scheme, resolve);
                container.appendChild(sel.cardNode);
            })
        })
    }

    waitForResult() {
        return Promise.race<ColorScheme | null>([this.waitForCancel(), this.waitForSelect()]);
    }

    async select(): Promise<ColorScheme | null> {
        var result: ColorScheme | null = null;
        try {
            await this.init();
            this.popup.show();
            result = await this.waitForResult();
        }
        catch (err) {
            if (err instanceof Error)
                new Toast(err.message).show()
            console.error(err);
        }
        finally {
            this.popup.hide();
            this.popup.deinit();
            return result;
        }
    }
}
