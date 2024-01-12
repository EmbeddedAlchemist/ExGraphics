var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "./assert.js";
import { GraphicsObject } from "./graphics-object.js";
import { Toast } from "./toast.js";
import { LoadingScreen } from "./loading-screen.js";
const workspace = document.getElementById('workspace');
const contextMenu = document.getElementById('workspaceContextMenu');
var focusedElement = null;
var rootElement = null;
var zoomFactor = 1.0;
export function increase_zoom_factor() {
    zoomFactor += 0.2;
    if (zoomFactor > 10)
        zoomFactor = 10;
    rootElement === null || rootElement === void 0 ? void 0 : rootElement.recursiveApplyZoom(zoomFactor);
}
export function decrease_zoom_factor() {
    zoomFactor -= 0.2;
    if (zoomFactor < 0)
        zoomFactor = 0;
    rootElement === null || rootElement === void 0 ? void 0 : rootElement.recursiveApplyZoom(zoomFactor);
}
function loadProperty(obj) {
    const root = document.getElementById('objectPropContainer');
    assert(root != null);
    var propList = obj.getPropertyNodeList();
    root.innerHTML = '';
    propList.forEach((prop) => {
        root.appendChild(prop);
    });
}
export function focusObject(obj, state = true) {
    if (state) {
        if (focusedElement)
            focusObject(focusedElement, false);
        focusedElement = obj;
        obj.eleNode.setAttribute('focused', '');
    }
    else
        obj.eleNode.removeAttribute('focused');
    loadProperty(obj);
}
export function hoverObject(obj, state = true) {
    if (state) {
        obj.eleNode.setAttribute('hover', '');
        var p = obj.eleNode.parentElement;
        while (p.classList.contains('graphics-object')) {
            p.removeAttribute('hover');
            p = p.parentElement;
        }
    }
    else
        obj.eleNode.removeAttribute('hover');
}
function showContextMenu(x, y) {
    contextMenu.style.top = y + 'px';
    contextMenu.style.left = x + 'px';
    contextMenu.style.display = 'block';
    console.log(contextMenu.style);
}
function hideContextMenu() {
    contextMenu.style.display = 'none';
}
export function contextMenuHandler(obj, event) {
    console.log(obj);
    showContextMenu(event.clientX, event.clientY);
}
function constructFromJSONObject(jsonObj) {
    if (!jsonObj.elements)
        throw SyntaxError('No elements node');
    rootElement = new GraphicsObject(jsonObj.elements);
    workspace.innerHTML = '';
    workspace.appendChild(rootElement.eleNode);
    rootElement.eleNode.style.position = 'relative';
    focusObject(rootElement);
}
export function loadFromFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file.name.endsWith('.exgraphics.json')) {
            new Toast("Unsupported type");
            return;
        }
        var loadingScreen = new LoadingScreen();
        loadingScreen.show();
        try {
            var raw_content = yield file.text();
            const content = JSON.parse(raw_content);
            console.log(content);
            constructFromJSONObject(content);
            new Toast(`${file.name} loaded`);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                new Toast(`Failed because of syntax error`, 'error').show();
            }
            else {
                new Toast(`Failed because of unknown error`, 'error').show();
            }
            console.error(e);
        }
        finally {
            loadingScreen.hide();
        }
    });
}
function save() {
    new Toast('Saved').show();
}
export function getObjectByName(name, element = rootElement) {
    if (!element)
        return null;
    if (element.name === name)
        return element;
    for (const ele of element.children) {
        const result = getObjectByName(name, ele);
        if (result != null)
            return result;
    }
    return null;
}
export function init() {
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key == 's') {
            save();
            e.preventDefault();
        }
    });
    document.addEventListener('mouseup', e => {
        hideContextMenu();
    });
}
