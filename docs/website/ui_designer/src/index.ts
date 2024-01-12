import './background.js'
import { Toast } from './toast.js';
import { GraphicsObject } from './graphics-object.js';
import * as WorkSpace from './workspace.js'
import { FontStyleCreator } from './font-style-editor.js';
import { FontStyleSelector } from './font-style-selector.js';
import { LoadingScreen } from './loading-screen.js';
import { ColorSchemeEditor } from './color-scheme-editor.js';
import { ColorSchemeSelector } from './color-scheme-selector.js';


function init_full_screen_btn() {
    const root = document.querySelector(':root')!!;
    const full_screen_btn = document.getElementById('full_screen_btn')!!;
    full_screen_btn.addEventListener('click', (e) => {
        if (!document.fullscreenElement) {
            root.requestFullscreen();
            full_screen_btn.setAttribute('tips', 'Exit Full Screen');
        }
        else {
            document.exitFullscreen();
            full_screen_btn.setAttribute('tips', 'Enter Full Screen');

        }
    })
}

function init_left_bar() {
    const left_bar = document.getElementById('left-bar')!!;
    const resize_handle = left_bar.querySelector('.drag-bar')!!;
    let start_x = 0;
    let ori_width = 0;
    resize_handle.addEventListener('mousedown', (e: any) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(left_bar).width);
        let move_handler = (e: any) => {
            // console.log(e.clientX)
            let width = ori_width + e.clientX - start_x;
            width = Math.min(Math.max(width, 200), window.innerWidth * 0.4);
            left_bar.style.setProperty('--width', width + 'px')
        }

        let up_handler = (e: any) => {
            document.removeEventListener('mousemove', move_handler);
            document.removeEventListener('mouseup', up_handler);
        }
        document.addEventListener('mousemove', move_handler)
        document.addEventListener('mouseup', up_handler)
    })
}

function init_right_bar() {
    const right_bar = document.getElementById('right-bar')!!;
    const resize_handle = right_bar.querySelector('.drag-bar')!!;
    let start_x = 0;
    let ori_width = 0;
    resize_handle.addEventListener('mousedown', (e: any) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(right_bar).width);
        // console.log(start_x, ori_width);
        let move_handler = (e: any) => {
            // console.log(e.clientX)
            // right_bar.style.setProperty('--width', ori_width - (e.clientX - start_x) + 'px')
            let width = ori_width - e.clientX + start_x;
            width = Math.min(Math.max(width, 200), window.innerWidth * 0.4);
            right_bar.style.setProperty('--width', width + 'px')
        }

        let up_handler = (e: any) => {
            document.removeEventListener('mousemove', move_handler);
            document.removeEventListener('mouseup', up_handler);
        }
        document.addEventListener('mousemove', move_handler)
        document.addEventListener('mouseup', up_handler)
    })
}

function init_sider_bar() {
    const sider_bar = document.querySelectorAll('.sider-bar');
    sider_bar.forEach((sider) => {
        function setState(state: boolean) {
            localStorage.setItem(pin_state_key, state.toString());
            sider.setAttribute('pinned', state.toString());
        }
        const pin_btn = sider.querySelectorAll('.content-area>.top-bar>*[tag=pin-btn]');
        const pin_state_key = sider.id + "_pin_state";
        let pin_state: boolean = localStorage.getItem(pin_state_key) === 'true';
        setState(pin_state);
        pin_btn.forEach((pin) => {
            pin.addEventListener('click', () => {
                pin_state = !pin_state;
                setState(pin_state);
            })
        })
    })
}


function init_workspace() {
    const workspace = document.getElementById('workspace')!!;
    function mousewheelHandler(e: any) {

        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0 || e.detail < 0) {
                WorkSpace.increase_zoom_factor()
            }
            else {
                WorkSpace.decrease_zoom_factor();
            }
        }
    }
    workspace.addEventListener('mousewheel', mousewheelHandler);
    workspace.addEventListener('DOMMouseScroll', mousewheelHandler);
}

function init_color_scheme() {
    const root = document.querySelector(':root')!!;
    function update_color_scheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('color-scheme', 'dark')
        }
        else {
            root.setAttribute('color-scheme', 'light')
        }
    }
    update_color_scheme();
    window.matchMedia('(prefers-color-scheme: dark)').addListener(update_color_scheme);
}



function init_open_file_btn() {
    const open_file_btn = document.getElementById('open_file_btn')!!
    open_file_btn.addEventListener('click', (e) => {
        const input_tag = document.createElement('input')!!;
        input_tag.setAttribute('type', 'file');
        input_tag.setAttribute('accept', '.exgraphics.json');
        input_tag.click();
        input_tag.addEventListener('change', (e) => {
            console.log(input_tag.files);
            if (input_tag.files?.length == 0) {
                new Toast("No files selected");
                return;
            }
            // console.log( GraphicsObject)
            WorkSpace.loadFromFile(input_tag.files!![0]);
        })
    })
}

function init_zoom_in_btn() {
    const zoom_in_btn = document.getElementById('zoom_in_btn')!!;
    zoom_in_btn.addEventListener('click', () => {
        WorkSpace.increase_zoom_factor();
    })
}

function init_zoom_out_btn() {
    const zoom_out_btn = document.getElementById('zoom_out_btn')!!;
    console.log(zoom_out_btn);
    zoom_out_btn.addEventListener('click', () => {
        WorkSpace.decrease_zoom_factor();
    })
}

function init_new_window_btn() {
    const new_window_btn = document.getElementById('new_window_btn')!!;
    new_window_btn.addEventListener('click', () => {
        // console.log("111");
        window.open(
            "./index.html",
            undefined,
            'popup,depended=no,status=no,location=no,toolbar=no,menubar=no,scrollbars=no');
        // window.close();
    })
}

function init_font_btn() {
    const font_btn = document.getElementById('font_btn');
    font_btn?.addEventListener('click', async () => {
        var a = await new FontStyleSelector().select();
        console.log(a?.serialize());
    })
}

function init_color_btn() {
    const color_btn = document.getElementById('color_btn');
    console.log(color_btn);
    color_btn?.addEventListener('click', async () => {
        console.log('clicked');
        var a = await new ColorSchemeSelector().select();
        console.log(a); 
    })
}

window.addEventListener('load', (e) => {
    init_color_scheme();
    init_full_screen_btn();
    init_sider_bar();
    init_workspace();
    init_left_bar();
    init_right_bar();
    init_open_file_btn();
    init_zoom_in_btn();
    init_zoom_out_btn();
    init_new_window_btn();
    init_font_btn();
    init_color_btn();
    WorkSpace.init();

    // window.addEventListener("beforeunload", (event) => {
    //     var tips = "You may save your work before leave";
    //     event.preventDefault();
    //     event.returnValue = tips;
    //     return tips
    // });
})


