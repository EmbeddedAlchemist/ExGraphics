function init_full_screen_btn() {
    const root = document.querySelector(':root');
    const full_screen_btn = document.getElementById('full_screen_btn');
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
    const left_bar = document.getElementById('left-bar');
    const resize_handle = left_bar.querySelector('.drag-bar');
    let start_x;
    let ori_width;
    resize_handle.addEventListener('mousedown', (e) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(left_bar).width);
        let move_handler = (e) => {
            // console.log(e.clientX)
            left_bar.style.setProperty('--width', ori_width + e.clientX - start_x + 'px')
        }

        let up_handler = (e) => {
            document.removeEventListener('mousemove', move_handler);
            document.removeEventListener('mouseup', up_handler);
        }
        document.addEventListener('mousemove', move_handler)
        document.addEventListener('mouseup', up_handler)
    })
}

function init_right_bar() {
    const right_bar = document.getElementById('right-bar');
    const resize_handle = right_bar.querySelector('.drag-bar');
    let start_x;
    let ori_width;
    resize_handle.addEventListener('mousedown', (e) => {
        start_x = e.clientX;
        ori_width = parseFloat(getComputedStyle(right_bar).width);
        // console.log(start_x, ori_width);
        let move_handler = (e) => {
            // console.log(e.clientX)
            right_bar.style.setProperty('--width', ori_width - (e.clientX - start_x) + 'px')
        }

        let up_handler = (e) => {
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
                    sider.setAttribute('pinned', false)
                else
                    sider.setAttribute('pinned', true);

            })
        })
    })
}


function init_workspace() {
    const workspace = document.getElementById('workspace');
    workspace.addEventListener('mousewheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            console.log('mousewheel');
        }
    })
}

function init_color_scheme() {
    const root = document.querySelector(':root');
    function update_color_scheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('color-scheme', 'dark')
        }
        else {
            root.setAttribute('color-scheme', 'light')
        }
        console.log(111);
    }
    update_color_scheme();
    window.matchMedia('(prefers-color-scheme: dark)').addListener(update_color_scheme);
}

window.addEventListener('load', (e) => {
    init_color_scheme();
    init_full_screen_btn();
    init_sider_bar();
    init_workspace();
    init_left_bar();
    init_right_bar();


})

