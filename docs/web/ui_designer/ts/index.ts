'use strict';

import { Toast } from './toast.js';
import { GraphicsObject } from './graphics-object.js';


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
    resize_handle.addEventListener('mousedown', (e:any) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(left_bar).width);
        let move_handler = (e:any) => {
            // console.log(e.clientX)
            let width = ori_width + e.clientX - start_x;
            width = Math.min(Math.max(width, 200), window.innerWidth * 0.4);
            left_bar.style.setProperty('--width', width + 'px')
        }

        let up_handler = (e:any) => {
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
    resize_handle.addEventListener('mousedown', (e:any) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(right_bar).width);
        // console.log(start_x, ori_width);
        let move_handler = (e:any) => {
            // console.log(e.clientX)
            // right_bar.style.setProperty('--width', ori_width - (e.clientX - start_x) + 'px')
            let width = ori_width - e.clientX + start_x;
            width = Math.min(Math.max(width, 200), window.innerWidth * 0.4);
            right_bar.style.setProperty('--width', width + 'px')
        }

        let up_handler = (e:any) => {
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
        const pin_btn = sider.querySelectorAll('.content-area>.top-bar>*[tag=pin-btn]');
        pin_btn.forEach((pin) => {
            pin.addEventListener('click', () => {
                if (sider.getAttribute('pinned') == 'true')
                    sider.setAttribute('pinned', "false")
                else
                    sider.setAttribute('pinned', "true");

            })
        })
    })
}


function init_workspace() {
    const workspace = document.getElementById('workspace')!!;
    workspace.addEventListener('mousewheel', (e:any) => {
        if (e.ctrlKey) {
            e.preventDefault();
            console.log('mousewheel');
        }
    })
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
            GraphicsObject.loadFromFile(input_tag.files!![0]);
        })
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
    console.log(111);
})

