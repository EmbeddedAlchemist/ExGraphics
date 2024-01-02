import { FontStyleCreator as FontStyleEditor } from "./font-style-editor.js";
import { FontStyle } from "./font-style.js";
import { PopupWindow } from "./popup-window.js";
import { Toast } from "./toast.js";

export class FontStyleSelector {

    static htmlCode: string | null = null;
    private popup: PopupWindow = new PopupWindow;

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

    private waitForContentLoaded() {
        var list: Promise<null>[] = [];
        console.log(111);
        this.popup.contentNode.querySelectorAll('[src], [href]').forEach((node) => { 
            node.addEventListener('load', () => { console.log('loaded2')})
        })
        this.popup.contentNode.querySelectorAll('[src], [href]').forEach((node) => {
            list.push(new Promise((resolve, reject) => {
                console.log(node);
                node.addEventListener('load', () => {
                    resolve(null);
                })
                node.addEventListener('error', () => {
                    reject(new Error('Error loading resource'));
                });
            }))
        })
        return Promise.all(list);
    }

    private async init() {
        var toast = new Toast("Loading");
        try {
            // console.log('111');
            if (FontStyleSelector.htmlCode == null) {
                toast.show(0);
                var htmlCode: string;
                htmlCode = await fetch('./font-style-selector.html')
                    .then((response) => {
                        if (response.ok != true) {
                            console.log(response)
                            throw new Error("Cannot fetch font-style-editor.html");
                            console.log(111);
                        }
                        return response.text()
                    })
                // console.log(htmlCode);
                FontStyleSelector.htmlCode = htmlCode;
                // console.log(this.popup.contentNode.innerHTML);
            }
            var doc = new DOMParser().parseFromString(FontStyleSelector.htmlCode, 'text/html');
            this.popup.contentNode.appendChild(doc.documentElement);
            this.popup.contentNode.querySelectorAll('[src], [href]').forEach((node) => { 
                node.addEventListener('load', () => { console.log('loaded1')})
            })

            const addBtn = this.popup.contentNode.querySelector('#addBtn');
            addBtn?.addEventListener('click', this.addFontStyle.bind(this))

        } finally {
            toast.hide();
        }
    }


    async select(): Promise<FontStyle | null> {
        var result = null;
        try {
            await this.init();
            this.popup.init();
            await this.waitForContentLoaded();
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