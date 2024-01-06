export class Toast {
    constructor(message, style = {}) {
        this.message_node = document.createElement('span');
        this.message_node.innerHTML = message;
        this.message_node.className = 'message';
        if (style.background)
            this.message_node.style.backgroundColor = style.background;
        if (style.foreground)
            this.message_node.style.color = style.foreground;
    }
    show(duration = 3000) {
        var _a;
        (_a = Toast.container) === null || _a === void 0 ? void 0 : _a.insertBefore(this.message_node, Toast.container.firstChild);
        var a = this.message_node.animate(Toast.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
        if (duration > 0) {
            a.addEventListener('finish', () => {
                setTimeout(this.hide.bind(this), duration);
            });
        }
    }
    hide() {
        this.message_node.animate(Toast.keyframes_out, { duration: 600 }).addEventListener('finish', () => {
            this.message_node.remove();
        });
    }
}
Toast.container = document.getElementById('toast-container');
Toast.keyframes_in = [
    {
        transform: "scale(1.1)",
        opacity: 0,
        filter: " blur(3px)",
        marginTop: "-36px"
    },
    {
        marginTop: "10px"
    }
];
Toast.keyframes_out = [
    {
        transform: "scale(1.1)",
        opacity: 0,
        filter: " blur(3px)",
        easing: "cubic-bezier(.1,.83,.22,.99)",
        marginTop: "10px",
        offset: 0.25,
    },
    {
        marginTop: "-36px",
        easing: "ease",
        opacity: 0,
    }
];
