export function SVGConstructor(svgString) {
    var result = new DOMParser().parseFromString(svgString, 'image/svg+xml').firstChild;
    if (result instanceof SVGElement) {
        return result;
    }
    throw new Error("Cannot parse SVG");
}
