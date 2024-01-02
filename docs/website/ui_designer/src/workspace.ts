import { GraphicsObject } from "./graphics-object.js";


export function increase_zoom_factor() {
    GraphicsObject.zoomFactor += 0.2;
    if (GraphicsObject.zoomFactor > 10) GraphicsObject.zoomFactor = 10;
    GraphicsObject.rootElement?.recursiveApplyStyle();

}

export function decrease_zoom_factor() { 
    GraphicsObject.zoomFactor -= 0.2;
    if (GraphicsObject.zoomFactor < 0) GraphicsObject.zoomFactor = 0;
    GraphicsObject.rootElement?.recursiveApplyStyle();

}