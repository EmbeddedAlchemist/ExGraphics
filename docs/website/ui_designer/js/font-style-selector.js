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
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";
export class FontStyleSelector {
    constructor() {
        this.popup = new PopupWindow('./font-style-selector.html');
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
        return Promise.race([
            this.waitForSelect(),
            this.waitForCancel()
        ]);
    }
    addFontStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            var newFont = yield new FontStyleEditor().edit();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var loadingScreen = new LoadingScreen();
            try {
                yield this.popup.load(() => loadingScreen.show());
                const addBtn = this.popup.contentNode.querySelector('#addBtn');
                addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', this.addFontStyle.bind(this));
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
            }
            catch (error) {
                if (error instanceof Error) {
                    new Toast(error.message).show();
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
FontStyleSelector.htmlCode = null;
