var character_set = ""

const font_name_input = document.getElementById("font_name_input");
const font_size_input = document.getElementById("font_size_input");
const font_weight_input = document.getElementById("font_weight_input");
const gray_scale_input = document.getElementById("gray_scale_input");

const english_preview = document.getElementById("english_preview");
const chinese_preview = document.getElementById("chinese_preview");

const ascii_number_symbol_select = document.getElementById("ascii_number_symbol_select");
const ascii_select = document.getElementById("ascii_select");
const gb2312_level1_select = document.getElementById("gb2312_level1_select");
const gb2312_level2_select = document.getElementById("gb2312_level2_select");
const custom_char_select = document.getElementById("custom_char_select");
const custom_char_input = document.getElementById("custom_char_input");
const info_box = document.getElementById("info_box");
const download_cpp_name = document.getElementById("download_cpp_name");
const download_hpp_name = document.getElementById("download_hpp_name");
const download_box = document.getElementById("download_box");

const english_preview_ctx = english_preview.getContext("2d");
const chinese_preview_ctx = chinese_preview.getContext("2d");

var english_preview_text = get_random_english_text();
var chinese_preview_text = get_random_chinese_text();

var conv_result;

function update_character_set() {

}

function draw_preview(canvas, font, text, gray_scale_max) {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.font = font;
    msr = ctx.measureText(text);
    var width = msr.width;
    var height = msr.fontBoundingBoxAscent + msr.fontBoundingBoxDescent;
    ctx.canvas.setAttribute("width", width);
    ctx.canvas.setAttribute("height", height);
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white"
    ctx.font = font;
    ctx.fillText(text, 0, msr.fontBoundingBoxAscent);
    var raw_img = ctx.getImageData(0, 0, width, height);
    var gray_scale_arr = RGBAToGrayScale(spArr(raw_img.data, 4), gray_scale_max);
    var pre_img = new ImageData(width, height);
    var pre_img_data = pre_img.data;
    gray_scale_arr.forEach((val, idx) => {
        var index = idx * 4;
        pre_img_data[index + 0] = 0x59;
        pre_img_data[index + 1] = 0x59;
        pre_img_data[index + 2] = 0xD8;
        pre_img_data[index + 3] = 255 * val / gray_scale_max;
    })
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.getContext("2d").putImageData(pre_img, 0, 0);


}

function get_font() {
    return `${font_weight_input.value} ${font_size_input.value}px ${font_name_input.value}`;
}


function get_random_english_text() {
    const textlist = [
        "ExGraphics!",
        "Lorem ipsum",
        "Legends never die",
        "Our souls defined",
        "Our hearts alive",
        "I remember your eye",
        "Can you hear me?",
        "I keep saying NO",
        "Under the sea",
        "Where are you now",
        "I'll be waiting for love",
        "Lost in your mind",
        "Never let me go",
        "I know I'm not alone",
        "On my god I lose control",
        "We live, we love, we lie",
    ];
    return textlist[Math.floor(Math.random() * textlist.length)];
}

function get_random_chinese_text() {
    const textlist = [
        "一生奔赴一场大无畏梦境",
        "长路漫漫 未来可期",
        "“魔法猫猫！稳辣！稳辣！”",
        "入秀逸山岚今古潮汐",
        "晚风吹起你鬓间的白发",
        "我曾难自拔于世界之大",
        "逆着光行走，任风吹雨打",
        "猝不及防闯入你的笑颜",
        "滚滚长江东逝水",
        "先帝创业未半而中道崩殂",
        "月黑见渔灯，孤光一点萤",
        "千山鸟飞绝，万径人踪灭",
        "是非成败转头空",
        "今夕何夕兮，搴舟中流",
        "今夕复何夕，共此灯烛光",
        "千里共如何，微风吹兰杜",
        "醉漾轻舟，信流引到花深处",
        "听说你要女装给我看？",
        "回家吧，回到最初的美好",
        "还记得你说家是唯一的城堡",
        "随着稻香河流继续奔跑",
        "微微笑，小时候的梦我知道",
        "不要哭让萤火虫带着你逃跑",
        "微微晨光点亮这喧嚣世界",
        "乌蒙山连着山外山！！",
        "月光洒向了响水滩！！",
        "该向前走还是继续等",
        "火树银花如昼，灯伎行歌舞貂袖",
        "像青鸟振翼，越过荒原冻雨",
        "在金碧枷锁，在无垠天地，诉尽爱语",
        "你多荒诞不经，多鲜活，多昳丽",
        "万物沉没于光影",
        "像孤舟巡游，不为逝水追惜",
        "在初逢灯火，在别时钟磬，自在随心",


    ]
    return textlist[Math.floor(Math.random() * textlist.length)];

}

function update_preview() {
    var font = get_font();
    var gray_scale_max = (1 << +gray_scale_input.value) - 1;
    draw_preview(english_preview, font, english_preview_text, gray_scale_max);
    draw_preview(chinese_preview, font, chinese_preview_text, gray_scale_max);
    // english_preview_ctx.clearRect(0, 0, english_preview_ctx.canvas.width, english_preview_ctx.canvas.height)
    // english_preview_ctx.drawImage(english_preview_image, 0, 0, english_preview_image.width * english_preview_ctx.canvas.height / english_preview_image.height, english_preview_ctx.canvas.height);
}





async function start_convert() {
    var char_set = get_char_set();
    var font_name = font_name_input.value;
    var font_size = font_size_input.value + "px";
    var font_weight = font_weight_input.value;
    var gray_scale_bits = gray_scale_input.value;
    var result = conv(char_set, font_name, font_size, font_weight, gray_scale_bits);
    conv_result = result;
    var info = [
        `font_name: ${result.font_name}`,
        `font_size: ${result.font_size}`,
        `font_weight: ${result.font_weight}`,
        `gray_scale_bits: ${result.gray_scale_bits}`,
        `ascent: ${result.ascent}px`,
        `descent: ${result.descent}px`,
        `def_name: ${result.def_name}`,
        `character_count: ${result.character_count}`,
        `font_size: ${((result.content_size + result.struct_size) / 1024).toFixed(2)}KB (${result.content_size + result.struct_size}Bytes)`,
        `  content: ${(result.content_size/1024).toFixed(2)}KB (${result.content_size}Bytes)`,
        `  struct: ${(result.struct_size / 1024).toFixed(2)}KB (${result.struct_size}Bytes)`,
    ]
    download_cpp_name.innerHTML = `${result.def_name}.cpp`;
    download_hpp_name.innerHTML = `${result.def_name}.hpp`;
    info_box.innerHTML = "";
    info.forEach((val, idx) => {
        var p = document.createElement("p");
        p.innerHTML = val;
        info_box.appendChild(p);

    })
}


function download_text_file(content, filename) {
    const blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    })
    const objectURL = URL.createObjectURL(blob)
    const aTag = document.createElement('a')
    aTag.href = objectURL
    aTag.download = filename
    aTag.click()
    URL.revokeObjectURL(objectURL)
}


function exec_with_debounce(method, delay) {
    clearTimeout(method.debounceTimeout);
    method.debounceTimeout = setTimeout(function () {
        method();
    }, delay);
}

function start_convert_debounce() {
    exec_with_debounce(start_convert, 1000);
}

font_weight_input.addEventListener("change", (e) => {
    update_preview()
    start_convert_debounce();
})

font_size_input.addEventListener("change", (e) => {
    update_preview()
    start_convert_debounce();
})

font_name_input.addEventListener("input", (e) => {
    update_preview()
    start_convert_debounce();
})

gray_scale_input.addEventListener("input", (e) => {
    update_preview()
    start_convert_debounce();
})

english_preview.addEventListener("click", (e) => {
    english_preview_text = get_random_english_text();
    update_preview();
})

chinese_preview.addEventListener("click", (e) => {
    chinese_preview_text = get_random_chinese_text();
    update_preview();
})


ascii_number_symbol_select.addEventListener("change", (e) => {
    start_convert_debounce();
})

ascii_select.addEventListener("change", (e) => {
    start_convert_debounce();
})
gb2312_level1_select.addEventListener("change", (e) => {
    start_convert_debounce();
})
gb2312_level2_select.addEventListener("change", (e) => {
    start_convert_debounce();
})
custom_char_select.addEventListener("change", (e) => {
    start_convert_debounce();
})
custom_char_input.addEventListener("change", (e) => {
    start_convert_debounce();
})


download_box.addEventListener("click", (e) => {
    download_text_file(conv_result.src_text, `${conv_result.def_name}.cpp`);
    download_text_file(conv_result.header_text, `${conv_result.def_name}.hpp`);
})


update_preview();
start_convert();