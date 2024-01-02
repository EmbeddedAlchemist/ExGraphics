import { FontStyleCreator as FontStyleEditor } from "./font-style-editor.js";
import { FontStyle } from "./font-style.js";
import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";

export class FontStyleSelector {

    static htmlCode: string | null = null;
    private popup: PopupWindow = new PopupWindow('./font-style-selector.html');

    private waitForSelect(): Promise<FontStyle> {
        return new Promise((resolve, reject) => {
        });
    }

    private waitForCancel(): Promise<null> {
        return new Promise((resolve, reject) => {
            this.popup.closeBtn.addEventListener("click", e => {
                resolve(null);
            })
        })
    }

    private waitForResult(): Promise<FontStyle | null> {
        return Promise.race([
            this.waitForSelect(),
            this.waitForCancel()
        ])
    }

    private async addFontStyle() {
        var newFont = await new FontStyleEditor().edit();
    }



    private async init() {
        var loadingScreen = new LoadingScreen();
        try {
            await this.popup.load(() => loadingScreen.show());
            const addBtn = this.popup.contentNode.querySelector('#addBtn');
            addBtn?.addEventListener('click', this.addFontStyle.bind(this))

        } finally {
            await loadingScreen.hide();
        }
    }


    async select(): Promise<FontStyle | null> {
        var result = null;
        try {
            this.popup.init();
            await this.init();
            this.popup.show();
            result = await this.waitForResult();
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
    }
}