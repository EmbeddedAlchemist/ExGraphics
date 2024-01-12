import { LoadingScreen } from "./loading-screen.js";
import { PopupWindow } from "./popup-window.js";
import { Style } from "./style.js";

export class StyleEditor{
    popup = new PopupWindow('./style-editor.html');
    constructor() {
        this.popup.title = 'Edit Style';
    }

    

    async init() {
        var loadingScreen = new LoadingScreen();
        try {
            this.popup.init();
            await this.popup.load(() => { loadingScreen.show() });
        }
        finally {
            await loadingScreen.hide();
        }
    }

    async edit(style: Style = new Style()): Promise<Style | null> { 
        var result: Style | null = null;
        try {
            await this.init();
            this.popup.show()
        }
        catch (err) { 

        }
        finally {
            this.popup.hide();
            this.popup.deinit();
            return result;
        }
    }
}