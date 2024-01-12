

export class Toast {
    static container = document.getElementById('toast-container');
    static keyframes_in: Keyframe[] = [
        {
            transform: "scale(1.1)",
            opacity: 0,
            filter: " blur(3px)",
            marginTop:"-36px"

        },
        {
            marginTop:"10px"

        }

    ]

    static keyframes_out: Keyframe[] = [
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
    ]

    message_node: HTMLElement;

    private getStyle(type: 'normal' | 'error'): { foreground: string, background: string }{
        const root = document.querySelector(':root') as HTMLHtmlElement;
        switch (type) { 
            case 'normal':
                return {
                    foreground: root.style.getPropertyValue('--text-color'),
                    background: root.style.getPropertyValue('--bg-color')
                }
            case 'error':
                return {
                    foreground: root.style.getPropertyValue('--error-color'),
                    background: root.style.getPropertyValue('--bg-color')
                }
        }
    }

    constructor(message: string, type: 'normal'|'error' = 'normal') {
        // console.log(Toast.container);
        this.message_node = document.createElement('span');
        this.message_node.innerHTML = message;
        this.message_node.className = 'message'; 
        
        const style = this.getStyle(type);
        // console.log(style)
        if (style.background) this.message_node.style.backgroundColor = style.background;
        if (style.foreground) this.message_node.style.color = style.foreground;
        // this.show(duration);
    }

    show(duration: number = 3000) {
        Toast.container?.insertBefore(this.message_node, Toast.container.firstChild);
        var a = this.message_node.animate(Toast.keyframes_in, { duration: 400, easing: 'cubic-bezier(.1,.83,.22,.99)' });
        if (duration > 0) {
            a.addEventListener('finish', () => {
                setTimeout(this.hide.bind(this), duration);
            })
        }
    }

    hide() {
        this.message_node.animate(Toast.keyframes_out, { duration: 600 }).addEventListener('finish', () => {
            this.message_node.remove();
        })
    }
}
