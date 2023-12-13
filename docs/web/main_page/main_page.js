import * as StackBlur from "./stackblur-es.js"

const main_page_bg = document.getElementById("main_page_bg");

document.getElementById("getting_start_btn")?.addEventListener("click", (e) => {
    document.location.assign("https://github.com/EmbeddedAlchemist/ExGraphics")
})









function main_page_bg_runtime() {
    var pos = [];

    function setMainBackgroundCancasSize() {
        main_page_bg.setAttribute("width", window.innerWidth / 8);
        main_page_bg.setAttribute("height", window.innerHeight / 8);
        pos = [
            { x: main_page_bg.width * 0.3, y: main_page_bg.height * 0.3, xd: 1, yd: 1, ax: -0.8, ay: -0.8, r: main_page_bg.height * 0.4, c: "#8C04A860" },
            { x: main_page_bg.width * 0.7, y: main_page_bg.height * 0.7, xd: -1, yd: -1, ax: 0.8, ay: 0.8, r: main_page_bg.height * 0.4, c: "#4512AE60" }
        ];
        var ctx = main_page_bg.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#202020"
        ctx.fillRect(0, 0, main_page_bg.width, main_page_bg.height);

    }
    window.addEventListener("resize", (e) => {
        setMainBackgroundCancasSize();
    })
    setMainBackgroundCancasSize();

    setInterval(() => {
        var ctx = main_page_bg.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#20202040"
        ctx.fillRect(0, 0, main_page_bg.width, main_page_bg.height);
        pos.forEach((p) => {
            ctx.fillStyle = p.c;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
            p.xd = Math.random() < 0.0005 ? - p.xd : p.xd;
            p.yd = Math.random() < 0.0005 ? - p.yd : p.yd;
            p.ax = p.ax * 0.95 + 0.05 * p.xd * Math.random() * 0.1;
            p.ay = p.ay * 0.95 + 0.05 * p.yd * Math.random() * 0.1;
            p.ax += -(p.x - main_page_bg.width / 2) / (main_page_bg.width / 2) * 0.010;
            p.ay += -(p.y - main_page_bg.height / 2) / (main_page_bg.height / 2) * 0.010;

            p.ay += Math.random() < 0.001 ? (Math.random() - 0.5) * 2 : 0;
            p.ax += Math.random() < 0.001 ? (Math.random() - 0.5) * 2 : 0;

            p.x += p.ax;
            p.y += p.ay;
        })

        StackBlur.canvasRGBA(main_page_bg, 0, 0, main_page_bg.width, main_page_bg.height, 50)
    }, 15);
}

main_page_bg_runtime();



