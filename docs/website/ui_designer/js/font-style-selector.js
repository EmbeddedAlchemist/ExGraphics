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
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";
export class FontStyleSelector {
    constructor() {
        this.popup = new PopupWindow;
    }
    waitForSelect() {
        return new Promise((resolve, reject) => {
        });
    }
    waitForCancel() {
        return new Promise((resolve, reject) => {
            this.popup.closeBtn.addEventListener("click", e => {
                resolve(null);
            });
        });
    }
    waitForResult() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.race([
                this.waitForSelect(),
                this.waitForCancel()
            ]);
        });
    }
    addFontStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            var newFont = new FontStyleEditor().edit();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var toast = new Toast("Loading");
            try {
                if (FontStyleSelector.htmlCode == null) {
                    toast.show(0);
                    var htmlCode;
                    htmlCode = yield fetch('./font-style-selector.html')
                        .then((response) => {
                        if (response.ok != true) {
                            console.log(response);
                            throw new Error("Cannot fetch font-style-editor.html");
                            console.log(111);
                        }
                        return response.text();
                    });
                    FontStyleSelector.htmlCode = htmlCode;
                }
                this.popup.contentNode.innerHTML = FontStyleSelector.htmlCode;
                const addBtn = this.popup.contentNode.querySelector('#addBtn');
                addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', this.addFontStyle.bind(this));
            }
            finally {
                toast.hide();
            }
        });
    }
    select() {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                yield this.init();
                this.popup.show();
                result = yield this.waitForResult();
            }
            catch (error) {
                if (error instanceof Error) {
                    new Toast(error.message).show();
                }
            }
            finally {
                this.popup.hide();
                return result;
            }
        });
    }
}
FontStyleSelector.htmlCode = null;
