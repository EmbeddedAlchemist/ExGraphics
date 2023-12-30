export class Toast {
    timeout_cb() {
        this.message_node.animate(Toast.keyframes_out, { duration: 200, easing: 'cubic-bezier(.57,.03,.83,.52)' }).addEventListener('finish', () => {
            this.message_node.remove();
        });
        // this.message_node.addEventListener('animationend', () => {
        //     this.message_node.remove();
        //     console.log('remove');
        // })
        // console.log('timeout');
    }
    constructor(message, duration = 3000, style = {}) {
        var _a;
        console.log(Toast.container);
        this.message_node = document.createElement('span');
        this.message_node.innerHTML = message;
        this.message_node.className = 'message';
        console.log(style);
        if (style.background)
            this.message_node.style.backgroundColor = style.background;
        if (style.foreground)
            this.message_node.style.color = style.foreground;
        (_a = Toast.container) === null || _a === void 0 ? void 0 : _a.appendChild(this.message_node);
        this.message_node.animate(Toast.keyframes_in, { duration: 500, easing: 'cubic-bezier(.17,.67,.26,.99)' }).addEventListener('finish', () => {
            setTimeout(this.timeout_cb.bind(this), duration);
        });
    }
}
Toast.container = document.getElementById('toast-container');
Toast.keyframes_in = [
    {
        transform: "scale(1.2)",
        opacity: 0,
        filter: " blur(3px)"
    }, {
    // opacity: 1,
    }
];
Toast.keyframes_out = [
    {
    // transform: "unset",
    // opacity: 1,
    // filter: "unset"
    },
    {
        transform: "scale(1.2)",
        opacity: 0,
        filter: " blur(3px)"
    },
];
