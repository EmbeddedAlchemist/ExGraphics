import { Toast } from "./toast.js";
// const Toast = require("toast.ts");

export class GraphicsObject {
    static focusedElement: GraphicsObject | null = null;
    static rootElement: GraphicsObject | null = null;
    static zoomFactor: number = 1.0;

    node: HTMLElement;
    name: string = 'Unnamed';

    width: number = 0;
    height: number = 0;

    top: number = 0;
    left: number = 0;

    children: Array<GraphicsObject> = []; 
    constructor(json_obj: any) {
        if (typeof json_obj.name == 'string') this.name = json_obj.name;
        if (typeof json_obj.width == 'number') this.width = json_obj.width;
        if (typeof json_obj.height == 'number') this.height = json_obj.height;
        if (typeof json_obj.top == 'number') this.top = json_obj.top;
        if (typeof json_obj.left == 'number') this.left = json_obj.left;
        this.node = document.createElement('div');
        this.node.className = "graphics-object";
        this.node.setAttribute('obj-name', this.name);
        this.node.addEventListener('mouseover', this.mouseoverHandler.bind(this));
        this.node.addEventListener('mouseout', this.mouseoutHandler.bind(this))
        this.node.addEventListener('click', this.clickHandler.bind(this));
        this.applyStyle();
        if (json_obj.children instanceof Array) {
            json_obj.children.forEach((ele: any) => {
                let children = new GraphicsObject(ele);
                this.children.push(children);
                this.node.appendChild(children.node);
            })
        }
    }

    applyStyle() {
        this.node.style.width = `${this.width * GraphicsObject.zoomFactor}px`;
        this.node.style.height = `${this.height * GraphicsObject.zoomFactor}px`;
        this.node.style.left = `${this.left * GraphicsObject.zoomFactor}px`;
        this.node.style.top = `${this.top * GraphicsObject.zoomFactor}px`;
    }

    recursiveApplyStyle() { 
        this.applyStyle();
        this.children.forEach((child) => {
            child.recursiveApplyStyle();
        })
    }

    focus(state: boolean = true) {
        if (state) {
            GraphicsObject.focusedElement?.focus(false);
            GraphicsObject.focusedElement = this;
            this.node.setAttribute('focused', '');
        }
        else this.node.removeAttribute('focused');
    }

    hover(state: boolean = true) {
        if (state) {
            this.node.setAttribute('hover', '')
            var p: HTMLElement = this.node.parentElement!!;
            while (p.classList.contains('graphics-object')) {
                p.removeAttribute('hover');
                p = p.parentElement!!;
            }
        }
        else this.node.removeAttribute('hover');
    }

    mouseoverHandler(e: Event) {
        this.hover(true);
        e.stopPropagation()
    }

    mouseoutHandler(e: Event) { this.hover(false); }

    clickHandler(e: Event) {
        this.focus(true);
        e.stopPropagation();
    }

    private static constructFromJSONObject(jsonObj: any) {
        if (!jsonObj.elements)
            throw SyntaxError('No elements node');
        GraphicsObject.rootElement = new GraphicsObject(jsonObj.elements);
        const workspace = document.getElementById('workspace')!!;
        workspace.innerHTML = '';
        workspace.appendChild(GraphicsObject.rootElement.node);
        GraphicsObject.rootElement.node.style.position = 'relative';
        GraphicsObject.rootElement.focus();
    }

    static loadFromFile(file: File) {
        if (!file.name.endsWith('.exgraphics.json')) {
            new Toast("Unsupported type");
            return;
        }
        file.text().then((raw_content) => {
            try {
                const content = JSON.parse(raw_content);
                console.log(content);
                GraphicsObject.constructFromJSONObject(content)
                new Toast(`${file.name} loaded`);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    new Toast(`Failed because of syntax error`, { background: "red", foreground: 'white' }).show();
                }
                else {
                    new Toast(`Failed because of unknown error`, { background: "red", foreground: 'white' }).show();
                }
            }

        })
    }
}



// window.addEventListener('load', e => {
//     var gsobj = document.querySelectorAll('.graphics-object');
//     gsobj.forEach(element => new GraphicsObject(element));
// })