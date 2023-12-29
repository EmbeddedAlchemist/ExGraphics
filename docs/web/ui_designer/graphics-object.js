"use strict";
class GraphicsObject {
    constructor(node) {
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.children = [];
        this.node = node;
        this.node.addEventListener('mouseover', this.mouseoverHandler.bind(this));
        this.node.addEventListener('mouseout', this.mouseoutHandler.bind(this));
        this.node.addEventListener('click', this.clickHandler.bind(this));
    }
    focus(state = true) {
            this.node.setAttribute('focused', state);
    }
    hover(state = true) {
            this.node.setAttribute('hover', state);
    }
    mouseoverHandler(e) {
        this.hover(true);
        var p = this.node.parentElement;
        while (p.classList.contains('graphics-object')) {
            p.removeAttribute('hover');
            p = p.parentElement;
        }
        e.stopPropagation();
    }
    mouseoutHandler(e) { this.hover(false); }
    clickHandler(e) {
        var _a;
        (_a = GraphicsObject.focusedElement) === null || _a === void 0 ? void 0 : _a.focus(false);
        GraphicsObject.focusedElement = this;
        this.focus(true);
        e.stopPropagation();
    }
}
GraphicsObject.focusedElement = null;
window.addEventListener('load', e => {
    var gsobj = document.querySelectorAll('.graphics-object');
    gsobj.forEach(element => new GraphicsObject(element));
});
