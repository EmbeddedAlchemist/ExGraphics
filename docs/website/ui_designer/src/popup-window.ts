
export class PopupWindow {
    static initialHTML: string = '<div class="popup-window">\
            <div class="top-bar">\
                <span class="title">Untitle</span>\
                <div class="icon-button close-btn" tips="Close">\
                     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">\
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>\
                    </svg>\
                </div>\
            </div>\
            <div class="content">\
            </div>\
        </div>';

    static rootContainer: HTMLElement = document.getElementById("popup-container")!!;

    private windowNode: HTMLElement = document.createElement('div');
    private topBarNode: HTMLElement;
    contentNode: HTMLElement;
    private titleNode: HTMLElement;
    closeBtn: HTMLElement;

    static keyframes_in: Keyframe[] = [{ transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" }, {}];
    static keyframes_out: Keyframe[] = [{}, { transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" },];

    private playingAmimation: Animation | null = null;
    private url: string;

    static urlBuffer: { [key: string]: string } = {};

    constructor(url: string) {
        this.url = url;
        this.windowNode.className = "popup-window-background";
        this.windowNode.innerHTML = PopupWindow.initialHTML;

        this.topBarNode = this.windowNode.querySelector('.top-bar')!!;
        this.contentNode = this.windowNode.querySelector('.content')!!;
        this.titleNode = this.windowNode.querySelector('.title')!!;
        this.closeBtn = this.windowNode.querySelector('.close-btn')!!;

        // this.closeBtn.addEventListener("click", this.hide.bind(this));
    }

    set title(val: string) { this.titleNode.innerHTML = val; }
    get title() { return this.titleNode.innerHTML; }

    private waitForContentLoaded() {
        var list: Promise<null>[] = [];
        this.contentNode.querySelectorAll('[src], [href]').forEach((node) => {
            list.push(new Promise((resolve, reject) => {
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

    init() {
        this.windowNode.style.display = "none";
        PopupWindow.rootContainer.appendChild(this.windowNode);
    }

    async load(nonBufferedCallback: (() => void) | undefined = undefined) {
        if (!PopupWindow.urlBuffer[this.url]) {
            if (nonBufferedCallback) nonBufferedCallback();
            PopupWindow.urlBuffer[this.url] = await fetch(this.url).then((response) => {
                if (!response.ok)
                    throw new Error('Failed to fetch ' + this.url + ' with code ' + response.status);
                return response.text();
            })
        }
        var doc = new DOMParser().parseFromString(PopupWindow.urlBuffer[this.url], 'text/html');
        this.contentNode.appendChild(doc.documentElement);
        await this.waitForContentLoaded();
    }

    show() {
        this.windowNode.style.display = "";
        this.windowNode.animate(PopupWindow.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
    }

    hide() {
        if (PopupWindow.rootContainer.contains(this.windowNode)) {
            var a = this.windowNode.animate(PopupWindow.keyframes_out, { duration: 150, easing: 'cubic-bezier(.57,.03,.83,.52)' })
            return new Promise((resolve, reject) => {
                a.addEventListener('finish', () => {
                    this.windowNode.style.display = 'none';
                    resolve(null)
                })
            })
        }
        else
            return new Promise<null>((resolve, reject) => { resolve(null) })
    }

    deinit() {
        var ani = this.windowNode.getAnimations();
        if (ani.length > 0) {
            ani[ani.length - 1].addEventListener('finish', () => {
                PopupWindow.rootContainer.removeChild(this.windowNode);
            })
        }
        else {
            PopupWindow.rootContainer.removeChild(this.windowNode);
        }
        // if(this.windowNode.getAnimations()[0].playState)
    }

}