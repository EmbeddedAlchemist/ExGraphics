import { GraphicsObject } from "./graphics-object.js";
export function increase_zoom_factor() {
    var _a;
    GraphicsObject.zoomFactor += 0.2;
    if (GraphicsObject.zoomFactor > 10)
        GraphicsObject.zoomFactor = 10;
    (_a = GraphicsObject.rootElement) === null || _a === void 0 ? void 0 : _a.recursiveApplyStyle();
}
export function decrease_zoom_factor() {
    var _a;
    GraphicsObject.zoomFactor -= 0.2;
    if (GraphicsObject.zoomFactor < 0)
        GraphicsObject.zoomFactor = 0;
    (_a = GraphicsObject.rootElement) === null || _a === void 0 ? void 0 : _a.recursiveApplyStyle();
}
