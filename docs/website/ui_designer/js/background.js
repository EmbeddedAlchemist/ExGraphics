import * as StackBlur from "./stackblur-es.min.js";
function main_page_bg_runtime() {
    const root = document.querySelector(":root");
    const main_page_bg = document.getElementById("main_page_bg");
    var pos = [
        { x: main_page_bg.width * 0.3, y: main_page_bg.height * 0.3, xd: 1, yd: 1, ax: -0.8, ay: -0.8, r: main_page_bg.height * 0.4, c: 290.0 },
        { x: main_page_bg.width * 0.5, y: main_page_bg.height * 0.5, xd: 1, yd: 1, ax: 0, ay: 0, r: main_page_bg.height * 0.4, c: 275.0 },
        { x: main_page_bg.width * 0.7, y: main_page_bg.height * 0.7, xd: -1, yd: -1, ax: 0.8, ay: 0.8, r: main_page_bg.height * 0.4, c: 260.0 }
    ];
    function setMainBackgroundCancasSize() {
        main_page_bg.setAttribute("width", window.innerWidth / 8);
        main_page_bg.setAttribute("height", window.innerHeight / 8);
        pos = [
            { x: main_page_bg.width * 0.3, y: main_page_bg.height * 0.3, xd: 1, yd: 1, ax: -0.8, ay: -0.8, r: main_page_bg.height * 0.4, c: pos[0].c },
            { x: main_page_bg.width * 0.5, y: main_page_bg.height * 0.5, xd: 1, yd: 1, ax: 0, ay: 0, r: main_page_bg.height * 0.4, c: pos[1].c },
            { x: main_page_bg.width * 0.7, y: main_page_bg.height * 0.7, xd: -1, yd: -1, ax: 0.8, ay: 0.8, r: main_page_bg.height * 0.4, c: pos[2].c }
        ];
        var ctx = main_page_bg.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#202020";
        ctx.fillRect(0, 0, main_page_bg.width, main_page_bg.height);
    }
    window.addEventListener("resize", (e) => {
        setMainBackgroundCancasSize();
    });
    setMainBackgroundCancasSize();
    setInterval(() => {
        var ctx = main_page_bg.getContext("2d", { willReadFrequently: true });
        var bg_color = getComputedStyle(root).getPropertyValue("--bg-color");
        var l = getComputedStyle(root).getPropertyValue("--bg-color-dynamic-l");
        var a = getComputedStyle(root).getPropertyValue("--bg-color-dynamic-a");
        ctx.fillStyle = bg_color;
        ctx.fillRect(0, 0, main_page_bg.width, main_page_bg.height);
        pos.forEach((p) => {
            ctx.fillStyle = `hsl(${p.c} 100% ${l}% / ${a}%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
            p.xd = Math.random() < 0.0005 ? -p.xd : p.xd;
            p.yd = Math.random() < 0.0005 ? -p.yd : p.yd;
            p.ax = p.ax * 0.95 + 0.05 * p.xd * Math.random() * 0.2;
            p.ay = p.ay * 0.95 + 0.05 * p.yd * Math.random() * 0.2;
            p.ax += -(p.x - main_page_bg.width / 2) / (main_page_bg.width / 2) * 0.010;
            p.ay += -(p.y - main_page_bg.height / 2) / (main_page_bg.height / 2) * 0.010;
            p.ay += Math.random() < 0.001 ? (Math.random() - 0.5) * 5 : 0;
            p.ax += Math.random() < 0.001 ? (Math.random() - 0.5) * 5 : 0;
            p.x += p.ax;
            p.y += p.ay;
            p.c += 0.01;
        });
        StackBlur.canvasRGBA(main_page_bg, 0, 0, main_page_bg.width, main_page_bg.height, 50);
    }, 30);
}
window.addEventListener('load', main_page_bg_runtime);
