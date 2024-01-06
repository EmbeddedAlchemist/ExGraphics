var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PopupWindow {
    constructor(url) {
        this.windowNode = document.createElement('div');
        this.playingAmimation = null;
        this.url = url;
        this.windowNode.className = "popup-window-background";
        this.windowNode.innerHTML = PopupWindow.initialHTML;
        this.topBarNode = this.windowNode.querySelector('.top-bar');
        this.contentNode = this.windowNode.querySelector('.content');
        this.titleNode = this.windowNode.querySelector('.title');
        this.closeBtn = this.windowNode.querySelector('.close-btn');
    }
    set title(val) { this.titleNode.innerHTML = val; }
    get title() { return this.titleNode.innerHTML; }
    waitForContentLoaded() {
        var list = [];
        this.contentNode.querySelectorAll('[src], [href]').forEach((node) => {
            list.push(new Promise((resolve, reject) => {
                node.addEventListener('load', () => {
                    resolve(null);
                });
                node.addEventListener('error', () => {
                    reject(new Error('Error loading resource'));
                });
            }));
        });
        return Promise.all(list);
    }
    init() {
        this.windowNode.style.display = "none";
        PopupWindow.rootContainer.appendChild(this.windowNode);
    }
    load(nonBufferedCallback = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PopupWindow.urlBuffer[this.url]) {
                if (nonBufferedCallback)
                    nonBufferedCallback();
                PopupWindow.urlBuffer[this.url] = yield fetch(this.url).then((response) => {
                    if (!response.ok)
                        throw new Error('Failed to fetch ' + this.url + ' with code ' + response.status);
                    return response.text();
                });
            }
            var doc = new DOMParser().parseFromString(PopupWindow.urlBuffer[this.url], 'text/html');
            this.contentNode.appendChild(doc.documentElement);
            yield this.waitForContentLoaded();
        });
    }
    show() {
        this.windowNode.style.display = "";
        this.windowNode.animate(PopupWindow.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
    }
    hide() {
        if (PopupWindow.rootContainer.contains(this.windowNode)) {
            var a = this.windowNode.animate(PopupWindow.keyframes_out, { duration: 150, easing: 'cubic-bezier(.57,.03,.83,.52)' });
            return new Promise((resolve, reject) => {
                a.addEventListener('finish', () => {
                    this.windowNode.style.display = 'none';
                    resolve(null);
                });
            });
        }
        else
            return new Promise((resolve, reject) => { resolve(null); });
    }
    deinit() {
        var ani = this.windowNode.getAnimations();
        if (ani.length > 0) {
            ani[ani.length - 1].addEventListener('finish', () => {
                PopupWindow.rootContainer.removeChild(this.windowNode);
            });
        }
        else {
            PopupWindow.rootContainer.removeChild(this.windowNode);
        }
    }
}
PopupWindow.initialHTML = '<div class="popup-window">\
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
PopupWindow.rootContainer = document.getElementById("popup-container");
PopupWindow.keyframes_in = [{ transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" }, {}];
PopupWindow.keyframes_out = [{}, { transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" },];
PopupWindow.urlBuffer = {};
