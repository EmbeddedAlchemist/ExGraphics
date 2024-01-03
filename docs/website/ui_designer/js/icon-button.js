export function IconButtonConstructor(tips, svg) {
    var res = document.createElement('div');
    res.className = 'icon-button';
    res.appendChild(svg);
    res.setAttribute('tips', tips);
    return res;
}
