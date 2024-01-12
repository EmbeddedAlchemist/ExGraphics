var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Style } from "./style.js";
export class StyleEditor {
    constructor() {
        this.popup = new PopupWindow('./style-editor.html');
        this.popup.title = 'Edit Style';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var loadingScreen = new LoadingScreen();
            try {
                this.popup.init();
                yield this.popup.load(() => { loadingScreen.show(); });
            }
            finally {
                yield loadingScreen.hide();
            }
        });
    }
    edit(style = new Style()) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = null;
            try {
                yield this.init();
                this.popup.show();
            }
            catch (err) {
            }
            finally {
                this.popup.hide();
                this.popup.deinit();
                return result;
            }
        });
    }
}
