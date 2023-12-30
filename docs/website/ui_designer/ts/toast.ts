

export class Toast {
    static container = document.getElementById('toast-container');
    static keyframes_in: Keyframe[] = [
        {
            transform: "scale(1.2)",
            opacity: 0,
            filter: " blur(3px)"
        }, {
            // opacity: 1,
        }

    ]

    static keyframes_out: Keyframe[] = [
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
    ]

    message_node: HTMLElement;

    timeout_cb() {
        this.message_node.animate(Toast.keyframes_out, { duration: 200, easing: 'cubic-bezier(.57,.03,.83,.52)' }).addEventListener('finish', () => {
            this.message_node.remove();
        })
        // this.message_node.addEventListener('animationend', () => {
        //     this.message_node.remove();
        //     console.log('remove');

        // })
        // console.log('timeout');
    }

    constructor(message: string, duration: number = 3000, style: { background?: string, foreground?: string } = {}) {
        console.log(Toast.container);
        this.message_node = document.createElement('span');
        this.message_node.innerHTML = message;
        this.message_node.className = 'message';
        console.log(style)
        if (style.background) this.message_node.style.backgroundColor = style.background;
        if (style.foreground) this.message_node.style.color = style.foreground;
        Toast.container?.appendChild(this.message_node);
        this.message_node.animate(Toast.keyframes_in, { duration: 500, easing: 'cubic-bezier(.17,.67,.26,.99)' }).addEventListener('finish', () => {
            setTimeout(this.timeout_cb.bind(this), duration);
        });
    }
}
