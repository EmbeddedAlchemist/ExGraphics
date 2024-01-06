import { Toast } from "./toast.js";
import * as WorkSpace from "./workspace.js";
import * as Check from "./check.js";
export class GraphicsObject {
    isValidName(name) {
        const excheck = Check.isExGraphicsVariantName(name);
        if (excheck.result != true) {
            return excheck;
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
    modifyNumberProp(property, input, value) {
        if (typeof value == 'string')
            value = parseInt(value);
        const valid = this.isValidNumber(value);
        if (valid.result != true) {
            new Toast(valid.reason).show();
            input.value = this[property].toString();
            input.setAttribute('state', 'normal');
            return;
        }
        this[property] = value;
        input.value = value.toString();
    }
    isValidNumber(value) {
        if (isNaN(value)) {
            return {
                result: false,
                reason: 'Invalid number'
            };
        }
        else if (value > 32767) {
            return {
                result: false,
                reason: 'Must less than 32767 (range of std::int16_t)'
            };
        }
        else if (value < -32768) {
            return {
                result: false,
                reason: 'Must greater than -32768 (range of std::int16_t)'
            };
        }
        else {
            return {
                result: true,
                reason: ''
            };
        }
    }
    set name(name) {
        const validResult = this.isValidName(name);
        if (validResult.result == false) {
            this.inputs.name.value = this._name;
            new Toast(validResult.reason).show();
            this.inputs.name.setAttribute('state', 'normal');
            return;
        }
        this._name = name;
        this.eleNode.setAttribute('obj-name', name);
    }
    get name() { return this._name; }
    ;
    set width(width) {
        this.modifyNumberProp('_width', this.inputs.width, width);
        this.applyZoom(this._zoomFactor);
    }
    get width() { return this._width; }
    ;
    set height(height) {
        this.modifyNumberProp('_height', this.inputs.height, height);
        this.applyZoom(this._zoomFactor);
    }
    get height() { return this._height; }
    ;
    set top(top) {
        this.modifyNumberProp('_top', this.inputs.top, top);
        this.applyZoom(this._zoomFactor);
    }
    get top() { return this._top; }
    ;
    set left(left) {
        this.modifyNumberProp('_left', this.inputs.height, left);
        this.applyZoom(this._zoomFactor);
    }
    get left() { return this._left; }
    ;
    initFromJSON(json_obj) {
        if (typeof json_obj.name == 'string')
            this._name = json_obj.name;
        if (typeof json_obj.width == 'number')
            this._width = json_obj.width;
        if (typeof json_obj.height == 'number')
            this._height = json_obj.height;
        if (typeof json_obj.top == 'number')
            this._top = json_obj.top;
        if (typeof json_obj.left == 'number')
            this._left = json_obj.left;
    }
    initChildFromJSON(json_obj) {
        if (json_obj.children instanceof Array) {
            json_obj.children.forEach((ele) => {
                let children = new GraphicsObject(ele);
                this.children.push(children);
                this.eleNode.appendChild(children.eleNode);
            });
        }
    }
    getPropertyNodeList(list = []) {
        list.unshift(this.propNode);
        return list;
    }
    initEleNode() {
        this.eleNode = document.createElement('div');
        this.eleNode.className = "graphics-object";
        this.eleNode.setAttribute('obj-name', this._name);
        this.eleNode.addEventListener('mouseover', this.mouseoverHandler.bind(this));
        this.eleNode.addEventListener('mouseout', this.mouseoutHandler.bind(this));
        this.eleNode.addEventListener('click', this.clickHandler.bind(this));
        this.eleNode.addEventListener('contextmenu', e => { this.contextmenuHandler(e); });
    }
    createPlainInputLabel(name, type = 'text', initalValue = "") {
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
        };
    }
    createInputLabelWithUnitSelection(name, type = 'number', selection, initalValue = "") {
        var inp = this.createPlainInputLabel(name, type, initalValue);
        var selectionNode = document.createElement('select');
        selectionNode.className = 'unit';
        inp.labelNode.appendChild(selectionNode);
        selection.forEach((sel) => {
            var opt = document.createElement('option');
            opt.value = sel;
            opt.innerText = sel;
            selectionNode.appendChild(opt);
        });
        return {
            labelNode: inp.labelNode,
            inputNode: inp.inputNode,
            selectNode: selectionNode
        };
    }
    setNameInputState() {
        if (this.isValidName(this.inputs.name.value).result)
            this.inputs.name.setAttribute('state', 'normal');
        else
            this.inputs.name.setAttribute('state', 'error');
    }
    setNumberInputState(input) {
        if (this.isValidNumber(parseInt(input.value)).result)
            input.setAttribute('state', 'normal');
        else
            input.setAttribute('state', 'error');
    }
    initPropNode() {
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
        this.inputs.name.addEventListener('change', () => { this.name = this.inputs.name.value; });
        this.inputs.width.addEventListener('change', () => { this.width = this.inputs.width.value; });
        this.inputs.height.addEventListener('change', () => { this.height = this.inputs.height.value; });
        this.inputs.left.addEventListener('change', () => { this.left = this.inputs.left.value; });
        this.inputs.top.addEventListener('change', () => { this.top = this.inputs.top.value; });
        this.inputs.name.addEventListener('input', this.setNameInputState.bind(this));
        this.inputs.width.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.width));
        this.inputs.height.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.height));
        this.inputs.top.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.top));
        this.inputs.left.addEventListener('input', this.setNumberInputState.bind(this, this.inputs.left));
    }
    constructor(json_obj, zoomFactor = 1) {
        this._name = 'Unnamed';
        this._width = 0;
        this._height = 0;
        this._top = 0;
        this._left = 0;
        this.children = [];
        this.inputs = {};
        this._zoomFactor = 1;
        this.initFromJSON(json_obj);
        this.initEleNode();
        this.initChildFromJSON(json_obj);
        this.initPropNode();
        this.applyZoom(zoomFactor);
    }
    applyZoom(factor) {
        this._zoomFactor = factor;
        this.eleNode.style.width = `${this._width * factor}px`;
        this.eleNode.style.height = `${this._height * factor}px`;
        this.eleNode.style.left = `${this._left * factor}px`;
        this.eleNode.style.top = `${this._top * factor}px`;
    }
    recursiveApplyZoom(factor) {
        this.applyZoom(factor);
        this.children.forEach((child) => {
            child.recursiveApplyZoom(factor);
        });
    }
    mouseoverHandler(e) {
        WorkSpace.hoverObject(this, true);
        e.stopPropagation();
    }
    mouseoutHandler(e) {
        WorkSpace.hoverObject(this, false);
    }
    clickHandler(e) {
        WorkSpace.focusObject(this, true);
        e.stopPropagation();
    }
    contextmenuHandler(e) {
        WorkSpace.contextMenuHandler(this, e);
        e.preventDefault();
    }
    constructJSONObject(obj = {}) {
        obj.name = this.name;
        obj.width = this.width;
        obj.height = this.height;
        obj.top = this.top;
        obj.left = this.left;
        return obj;
    }
    serialize(jsonObject) {
    }
    deserialize(jsonObj) {
    }
    getObjectType() { return "Object"; }
}
