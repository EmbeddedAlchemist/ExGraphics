var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FontStyleCreator as FontStyleEditor } from "./font-style-editor.js";
import { IconButtonConstructor } from "./icon-button.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { SVGConstructor } from "./svg-constructor.js";
import { Toast } from "./toast.js";
function SelectionCardConstructor(fontstyle, allowEdit) {
    var _a;
    const editIcon = SVGConstructor('<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>');
    var res = document.createElement('div');
    var previewContainer = document.createElement('div');
    var infoContainer = document.createElement('div');
    var previewCanvas = document.createElement('canvas');
    var mainInfo = document.createElement('p');
    var subInfo = document.createElement('p');
    res.className = 'item card';
    previewContainer.className = 'preview-container';
    infoContainer.className = 'info-container';
    mainInfo.className = 'main-info';
    subInfo.className = 'sub-info';
    previewContainer.appendChild(previewCanvas);
    infoContainer.appendChild(mainInfo);
    infoContainer.appendChild(subInfo);
    if (allowEdit) {
        res.appendChild(IconButtonConstructor('Edit', editIcon));
    }
    res.appendChild(previewContainer);
    res.appendChild(infoContainer);
    mainInfo.innerText = fontstyle.family;
    subInfo.innerText = `${fontstyle.size}px, ${fontstyle.weight}, ${fontstyle.grayScale}bit`;
    previewCanvas.width = fontstyle.previewImage.width;
    previewCanvas.height = fontstyle.previewImage.height;
    (_a = previewCanvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.putImageData(fontstyle.previewImage, 0, 0);
    return res;
}
function AddBtnConstructor() {
    const addIcon = SVGConstructor('<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M466-466H252v-28h214v-214h28v214h214v28H494v214h-28v-214Z"/></svg>');
    var res = document.createElement('div');
    var txt = document.createElement('span');
    txt.innerText = 'Add';
    res.className = 'item add-btn';
    res.appendChild(addIcon);
    res.appendChild(txt);
    return res;
}
export class FontStyleSelector {
    get fontList() { return this.listOfSelections; }
    ;
    constructor(listOfSelections = [], allowEdit = true) {
        this.popup = new PopupWindow('./font-style-selector.html');
        this.listOfSelections = listOfSelections.slice();
        this.allowEdit = allowEdit;
    }
    waitForSelect() {
        return new Promise((resolve, reject) => {
            const root = document.querySelector('.font-style-selector');
            if (!root)
                reject();
            if (this.allowEdit) {
                const addBtn = AddBtnConstructor();
                root.appendChild(addBtn);
                addBtn.addEventListener('click', e => { this.addFontStyle(resolve); });
            }
            this.listOfSelections.forEach((ele) => {
                const card = SelectionCardConstructor(ele, this.allowEdit);
                root.appendChild(card);
                card.addEventListener('click', (e) => { console.log('res2'); resolve(ele); });
            });
        });
    }
    waitForCancel() {
        return new Promise((resolve, reject) => {
            this.popup.closeBtn.addEventListener("click", e => {
                console.log('canceled');
                resolve(null);
            });
        });
    }
    waitForResult() {
        return Promise.race([
            this.waitForSelect(),
            this.waitForCancel()
        ]);
    }
    addFontStyle(resolve) {
        return __awaiter(this, void 0, void 0, function* () {
            var newFont = yield new FontStyleEditor().edit();
            const root = document.querySelector('.font-style-selector');
            if (!newFont || !root)
                return;
            console.log('adding font style');
            if (this.listOfSelections.some((ele) => { return ele.equals(newFont); })) {
                new Toast("Font is already in list").show();
                return;
            }
            this.listOfSelections.unshift(newFont);
            var fontCard = SelectionCardConstructor(newFont, this.allowEdit);
            root.insertBefore(fontCard, root.querySelector('.item.card'));
            fontCard.addEventListener('click', e => { console.log('res'); resolve(newFont); });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var loadingScreen = new LoadingScreen();
            try {
                yield this.popup.load(() => loadingScreen.show());
            }
            finally {
                yield loadingScreen.hide();
            }
        });
    }
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                this.popup.init();
                yield this.init();
                this.popup.show();
                result = yield this.waitForResult();
                console.log('result: ', result);
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    new Toast(error.message).show();
                }
                else {
                    new Toast('Failed.').show();
                }
            }
            finally {
                this.popup.hide();
                this.popup.deinit();
                return result;
            }
        });
    }
}
