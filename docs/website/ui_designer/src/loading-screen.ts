export class LoadingScreen {
    static initialHTML =
        '<div class="loading-window">\
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">\
                <path\
                    d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />\
                </svg>\
            <span>Loading</span>\
        </div>';
    static rootContainer: HTMLElement = document.getElementById("popup-container")!!;
    static keyframes_in: Keyframe[] = [{ transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" }, {}];
    static keyframes_out: Keyframe[] = [{}, { transform: "scale(1.1)", opacity: 0, filter: " blur(10px)" },];

    windowNode = document.createElement('div');

    constructor() {
        this.windowNode.className = 'popup-window-background';
        this.windowNode.innerHTML = LoadingScreen.initialHTML;
    }

    show() {
        LoadingScreen.rootContainer.appendChild(this.windowNode);
        var a = this.windowNode.animate(LoadingScreen.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
        return new Promise<null>(function (resolve, reject) { 
            a.addEventListener('finish', e=> {
                resolve(null);
            })
        })
    }

    hide() {
        if (LoadingScreen.rootContainer.contains(this.windowNode)) {
            var a = this.windowNode.animate(LoadingScreen.keyframes_out, { duration: 150, easing: 'cubic-bezier(.57,.03,.83,.52)' })
            return new Promise((resolve, reject) => {
                a.addEventListener('finish', () => {
                    LoadingScreen.rootContainer.removeChild(this.windowNode);
                    resolve(null)
                })
            })
        }
        else
            return new Promise<null>((resolve, reject) => {resolve(null)})
    }

}