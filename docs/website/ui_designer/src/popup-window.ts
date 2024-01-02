export class PopupWindow {
    static initialHTML: string = '\
        <div class="popup-window">\
            <div class="top-bar">\
                <span class="title">Untitle</span>\
                <div class="icon-btn close-btn" tips="Close">\
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

    static container = document.getElementById('toast-container');
    static keyframes_in: Keyframe[] = [{ transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" }, {}];
    static keyframes_out: Keyframe[] = [{}, { transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" },];


    constructor() {
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

    show() {
        PopupWindow.rootContainer.appendChild(this.windowNode);
        this.windowNode.animate(PopupWindow.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
    }

    hide() {
        this.windowNode.animate(PopupWindow.keyframes_out, { duration: 150, easing: 'cubic-bezier(.57,.03,.83,.52)' })
            .addEventListener('finish', () => {
                PopupWindow.rootContainer.removeChild(this.windowNode);
            })
    }

}