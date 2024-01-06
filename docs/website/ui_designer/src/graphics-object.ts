import { Toast } from "./toast.js";
// const Toast = require("toast.ts");
import * as WorkSpace from "./workspace.js"

import * as Check from "./check.js";



export class GraphicsObject {


    eleNode!: HTMLElement;

    _name: string = 'Unnamed';
    _width: number = 0;
    _height: number = 0;
    _top: number = 0;
    _left: number = 0;

    children: Array<GraphicsObject> = [];

    propNode!: HTMLElement;


    //@ts-ignore
    inputs: {
        name: HTMLInputElement,
        width: HTMLInputElement,
        height: HTMLInputElement,
        top: HTMLInputElement,
        left: HTMLInputElement,
        widthUint: HTMLSelectElement,
        heightUint: HTMLSelectElement,
        topUnit: HTMLSelectElement,
        leftUnit: HTMLSelectElement,
    } = {};

    private _zoomFactor: number = 1;


    private isValidName(name: string) {
        const excheck = Check.isExGraphicsVariantName(name);
        if (excheck.result != true) {
            return excheck
        }
        const same = WorkSpace.getObjectByName(name);
        if (same != null && same != this) {
            return {
                result: false,
                reason: `"${name}" is already used by other object`
            };
        }
        return {
            result: true,
            reason: ""
        };

    }


    private modifyNumberProp(property: '_width' | '_height' | '_top' | '_left', input: HTMLInputElement, value: string | number) {
        if (typeof value == 'string')
            value = parseInt(value);
        const valid = this.isValidNumber(value);
        if (valid.result != true) {
            new Toast(valid.reason).show();
            input.value = this[property].toString();
            input.setAttribute('state', 'normal')
            return;
        }
        this[property] = value;
        input.value = value.toString();

    }

    private isValidNumber(value: number) {
        if (isNaN(value)) {
            return {
                result: false,
                reason: 'Invalid number'
            }
        }
        else if (value > 32767) {
            return {
                result: false,
                reason: 'Must less than 32767 (range of std::int16_t)'
            }
        }
        else if (value < -32768) {
            return {
                result: false,
                reason: 'Must greater than -32768 (range of std::int16_t)'
            }
        }
        else {
            return {
                result: true,
                reason: ''
            }
        }
    }


    set name(name: string) {
        const validResult = this.isValidName(name);
        if (validResult.result == false) {
            this.inputs.name.value = this._name;
            new Toast(validResult.reason).show();
            this.inputs.name.setAttribute('state', 'normal')
            return;
        }
        this._name = name;
        this.eleNode.setAttribute('obj-name', name)
    }
    get name() { return this._name };

    set width(width: number | string) {
        this.modifyNumberProp('_width', this.inputs.width, width);
        this.applyZoom(this._zoomFactor);
    }
    get width() { return this._width };

    set height(height: number | string) {
        this.modifyNumberProp('_height', this.inputs.height, height);
        this.applyZoom(this._zoomFactor);
    }
    get height() { return this._height };

    set top(top: number | string) {
        this.modifyNumberProp('_top', this.inputs.top, top);
        this.applyZoom(this._zoomFactor);
    }
    get top() { return this._top };

    set left(left: number | string) {
        this.modifyNumberProp('_left', this.inputs.height, left);
        this.applyZoom(this._zoomFactor);
    }
    get left() { return this._left };

    private initFromJSON(json_obj: any) {
        if (typeof json_obj.name == 'string') this._name = json_obj.name;
        if (typeof json_obj.width == 'number') this._width = json_obj.width;
        if (typeof json_obj.height == 'number') this._height = json_obj.height;
        if (typeof json_obj.top == 'number') this._top = json_obj.top;
        if (typeof json_obj.left == 'number') this._left = json_obj.left;
    }

    private initChildFromJSON(json_obj: any) {
        if (json_obj.children instanceof Array) {
            json_obj.children.forEach((ele: any) => {
                let children = new GraphicsObject(ele);
                this.children.push(children);
                this.eleNode.appendChild(children.eleNode);
            })
        }
    }

    getPropertyNodeList(list: HTMLElement[] = []) {
        list.unshift(this.propNode);
        return list;
    }

    private initEleNode() {
        this.eleNode = document.createElement('div');
        this.eleNode.className = "graphics-object";
        this.eleNode.setAttribute('obj-name', this._name);
        this.eleNode.addEventListener('mouseover', this.mouseoverHandler.bind(this));
        this.eleNode.addEventListener('mouseout', this.mouseoutHandler.bind(this))
        this.eleNode.addEventListener('click', this.clickHandler.bind(this));
        this.eleNode.addEventListener('contextmenu', e => { this.contextmenuHandler(e) })
    }

    private createPlainInputLabel(name: string, type: string = 'text', initalValue: string = "") {
        var label = document.createElement('label');
        var span = document.createElement('span');
        span.className = 'label';
        span.innerText = name;
        var input = document.createElement('input');
        input.type = type;
        input.value = initalValue;
        input.spellcheck = false;
        label.appendChild(span);
        label.appendChild(input);
        return {
            labelNode: label,
            inputNode: input
        }
    }

    private createInputLabelWithUnitSelection(name: string, type: string = 'number', selection: string[], initalValue: string = "") {
        var inp = this.createPlainInputLabel(name, type, initalValue);
        var selectionNode = document.createElement('select');
        selectionNode.className = 'unit';
        inp.labelNode.appendChild(selectionNode);
        selection.forEach((sel) => {
            var opt = document.createElement('option');
            opt.value = sel;
            opt.innerText = sel;
            selectionNode.appendChild(opt);
        })
        return {
            labelNode: inp.labelNode,
            inputNode: inp.inputNode,
            selectNode: selectionNode
        }
    }


    private setNameInputState() {
        if (this.isValidName(this.inputs.name.value).result) this.inputs.name.setAttribute('state', 'normal');
        else this.inputs.name.setAttribute('state', 'error');
    }

    private setNumberInputState(input: HTMLInputElement) {
        if (this.isValidNumber(parseInt(input.value)).result)
            input.setAttribute('state', 'normal');
        else
            input.setAttribute('state', 'error');

    }



    private initPropNode() {


        this.propNode = document.createElement('div');
        this.propNode.className = 'graphics-object-properties-container';

        var res1 = this.createPlainInputLabel('Name', 'text', this.name);
        this.inputs.name = res1.inputNode;
        this.propNode.appendChild(res1.labelNode);


        var res2 = this.createInputLabelWithUnitSelection('Width', 'number', ['px', '%'], this.width.toString());
        this.inputs.width = res2.inputNode;
        this.inputs.widthUint = res2.selectNode;
        this.propNode.appendChild(res2.labelNode);

        res2 = this.createInputLabelWithUnitSelection('Height', 'number', ['px', '%'], this.height.toString());
        this.inputs.height = res2.inputNode;
        this.inputs.heightUint = res2.selectNode;
        this.propNode.appendChild(res2.labelNode);

        res2 = this.createInputLabelWithUnitSelection('Top', 'number', ['px', '%'], this.top.toString());
        this.inputs.top = res2.inputNode;
        this.inputs.topUnit = res2.selectNode;
        this.propNode.appendChild(res2.labelNode);

        res2 = this.createInputLabelWithUnitSelection('Left', 'number', ['px', '%'], this.left.toString());
        this.inputs.left = res2.inputNode;
        this.inputs.leftUnit = res2.selectNode;
        this.propNode.appendChild(res2.labelNode);

        this.inputs.name.addEventListener('change', () => { this.name = this.inputs.name.value })
        this.inputs.width.addEventListener('change', () => { this.width = this.inputs.width.value })
        this.inputs.height.addEventListener('change', () => { this.height = this.inputs.height.value })
        this.inputs.left.addEventListener('change', () => { this.left = this.inputs.left.value })
        this.inputs.top.addEventListener('change', () => { this.top = this.inputs.top.value })

        this.inputs.name.addEventListener('input', this.setNameInputState.bind(this))
        this.inputs.width.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.width))
        this.inputs.height.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.height))
        this.inputs.top.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.top))
        this.inputs.left.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.left))
    }

    constructor(json_obj: any, zoomFactor: number = 1) {
        this.initFromJSON(json_obj);
        this.initEleNode();
        this.initChildFromJSON(json_obj);
        this.initPropNode();
        this.applyZoom(zoomFactor);
    }

    applyZoom(factor: number): void {
        this._zoomFactor = factor;
        this.eleNode.style.width = `${this._width * factor}px`;
        this.eleNode.style.height = `${this._height * factor}px`;
        this.eleNode.style.left = `${this._left * factor}px`;
        this.eleNode.style.top = `${this._top * factor}px`;
    }

    recursiveApplyZoom(factor: number) {
        this.applyZoom(factor);
        this.children.forEach((child) => {
            child.recursiveApplyZoom(factor);
        })
    }



    private mouseoverHandler(e: Event) {
        WorkSpace.hoverObject(this, true);
        e.stopPropagation()
    }

    private mouseoutHandler(e: Event) {
        WorkSpace.hoverObject(this, false);
    }

    private clickHandler(e: Event) {
        WorkSpace.focusObject(this, true)
        e.stopPropagation();
    }

    private contextmenuHandler(e: MouseEvent) {
        WorkSpace.contextMenuHandler(this, e)
        e.preventDefault()
    }

    constructJSONObject(obj: any = {}):any {
        obj.name = this.name;
        obj.width = this.width;
        obj.height = this.height;
        obj.top = this.top;
        obj.left = this.left;
        return obj;
    }

    serialize(jsonObject:any) {
        
    }

    deserialize(jsonObj: any) { 

    }

    getObjectType(): string { return "Object"; }





}



// window.addEventListener('load', e => {
//     var gsobj = document.querySelectorAll('.graphics-object');
//     gsobj.forEach(element => new GraphicsObject(element));
// })