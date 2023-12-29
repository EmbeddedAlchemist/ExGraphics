class GraphicsObject {
    static focusedElement: GraphicsObject | null = null;

    node: Element;

    width: number = 0;
    height: number = 0;

    top: number = 0;
    left: number = 0;

    children: Array<GraphicsObject> = [];

    constructor(node: Element) {
        this.node = node;
        this.node.addEventListener('mouseover', this.mouseoverHandler.bind(this));
        this.node.addEventListener('mouseout', this.mouseoutHandler.bind(this))
        this.node.addEventListener('click', this.clickHandler.bind(this));
    }

    focus(state: boolean = true) {
        if (state) this.node.setAttribute('focused', '');
        else this.node.removeAttribute('focused');
    }

    hover(state: boolean = true) {
        if (state) this.node.setAttribute('hover', '');
        else this.node.removeAttribute('hover');
    }

    mouseoverHandler(e: Event) {
        this.hover(true);
        var p: HTMLElement = this.node.parentElement!!;
        while (p.classList.contains('graphics-object')) {
            p.removeAttribute('hover');
            p = p.parentElement!!;
        }
        e.stopPropagation()
    }

    mouseoutHandler(e: Event) { this.hover(false); }

    clickHandler(e: Event) {
        GraphicsObject.focusedElement?.focus(false);
        GraphicsObject.focusedElement = this;
        this.focus(true);
        e.stopPropagation();
    }
}




window.addEventListener('load', e => {
    var gsobj = document.querySelectorAll('.graphics-object');
    gsobj.forEach(element => new GraphicsObject(element));
})