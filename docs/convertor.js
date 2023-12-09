
const font_cancas = document.createElement("canvas");
// const start_conv = document.getElementById("start_conv");
// const char_input = document.getElementById("char_input");
// const font_name_input = document.getElementById("font_name_input");
// const font_size_input = document.getElementById("font_size_input");
// const font_weight_input = document.getElementById("font_weight_input");
// const gray_scale_input = document.getElementById("gray_scale_input");
// const output = document.getElementById("output");

var ctx = font_cancas.getContext("2d", { willReadFrequently: true });

function drawChar(ch, font) {
    ctx.font = font;

    mtr = ctx.measureText(ch);
    var baseLineHeight = Math.ceil(mtr.actualBoundingBoxAscent);
    font_cancas.setAttribute("width", Math.ceil(mtr.width));
    font_cancas.setAttribute("height", Math.ceil(mtr.actualBoundingBoxAscent + mtr.actualBoundingBoxDescent));

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, font_cancas.width, font_cancas.height);
    ctx.fillStyle = "white";
    ctx.font = font;
    ctx.fillText(ch, 0, baseLineHeight);

    return baseLineHeight;
}

function spArr(arr, num) {
    let newArr = []
    for (let i = 0; i < arr.length;) {
        newArr.push(arr.slice(i, i += num));
    }
    return newArr
}

function RGBAToGrayScale(arr_of_argb, gray_scale_max) {
    var gs_list = [];
    arr_of_argb.forEach((lst) => {
        gs_list.push(Math.round((lst[0] + lst[1] + lst[2]) / (255 + 255 + 255) * gray_scale_max));
    });
    return gs_list
}

function canvasToGrayScaleArray(gray_scale_max) {
    if (font_cancas.height == 0)
        return [[0]];
    raw_img_arr = ctx.getImageData(0, 0, font_cancas.width, font_cancas.height).data;
    gs_arr = spArr(RGBAToGrayScale(spArr(raw_img_arr, 4), gray_scale_max), font_cancas.width);
    return gs_arr;
}

function encode(gray_scale_aray, gray_scale_bits) {
    var arr_bits = [];
    gray_scale_aray.forEach((nl) => {
        nl.forEach((n) => {
            for (var x = 0; x < gray_scale_bits; x++) {
                arr_bits.push(+((n & ((1 << gray_scale_bits - 1) >> x)) != 0));
            }
        });
    });
    arr_bits = spArr(arr_bits, 8);
    var arr_int = [];
    arr_bits.forEach((bl) => {
        var v = 0;
        bl.forEach((bit, idx) => {
            v |= bit << (7 - idx);
        })
        arr_int.push(v);
    });
    return arr_int;
}

function stringToUTF8Int(str) {
    var utf8Int = 0;

    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);

        if (charCode < 0x80) {
            utf8Int = (utf8Int << 8) | charCode;
        } else if (charCode < 0x800) {
            utf8Int = (utf8Int << 8) | (0xC0 | ((charCode >> 6) & 0x3F));
            utf8Int = (utf8Int << 8) | (0x80 | (charCode & 0x3F));
        } else if (charCode < 0x10000) {
            utf8Int = (utf8Int << 8) | (0xE0 | ((charCode >> 12) & 0xF));
            utf8Int = (utf8Int << 8) | (0x80 | ((charCode >> 6) & 0x3F));
            utf8Int = (utf8Int << 8) | (0x80 | (charCode & 0x3F));
        } else {
            utf8Int = (utf8Int << 8) | (0xF0 | ((charCode >> 18) & 0x7));
            utf8Int = (utf8Int << 8) | (0x80 | ((charCode >> 12) & 0x3F));
            utf8Int = (utf8Int << 8) | (0x80 | ((charCode >> 6) & 0x3F));
            utf8Int = (utf8Int << 8) | (0x80 | (charCode & 0x3F));
        }
    }

    return utf8Int;
}


function get_def_name(font_name) {
    var def = PinyinHelper.convertToPinyinString(font_name, "_", PinyinFormat.WITHOUT_TONE);
    def = def.replace(/[^a-z0-9_]/gi, "_");
    return def;
}


function generateDef(arr_ch_encoded, font_name_raw, size, weight, gray_scale_bits) {
    var content_size = 0;
    var struct_size = 0;
    var ch_count = arr_ch_encoded.length;
    var base_name = `font_${get_def_name(font_name_raw)}_${size}_w${weight}_gs${gray_scale_bits}bit`;
    var content_defs = [];
    var resource_defs = []
    var characters_constructs = [];
    var character_set_name = `${base_name}_character_set`;
    arr_ch_encoded.forEach((value, index) => {
        var ch_code = stringToUTF8Int(value.char);
        var ch_name = `${base_name}_ch${ch_code}`;

        var content_name = `${ch_name}_content`;
        var content_def = `static const std::uint8_t ${content_name}[${value.length}] /* ${value.char} */ = { ${value.arr.join(", ")} };\n`
        content_size += value.arr.length;
        
        var res_name = `${ch_name}_resource`;
        var res_def = `static const LocalResource ${res_name}((const void *)${content_name}, ${value.length});\n`
        struct_size += 8;
        
        var characters_construct = `\tExGraphics::FontCharacter(${ch_code} /* ${value.char} */, ${res_name}, ExGraphics::Size(${value.size.width}, ${value.size.height}), ${gray_scale_bits}, ${value.offset.y})`
        struct_size += 17;

        content_defs.push(content_def);
        resource_defs.push(res_def);
        characters_constructs.push(characters_construct)
    });

    var character_set_def = `static const ExGraphics::FontCharacter ${character_set_name}[${arr_ch_encoded.length}] = {\n${characters_constructs.join(",\n")},\n};\n`
    var font_name = base_name;
    var font_def = `extern const ExGraphics::Font ${font_name}(${character_set_name}, ${arr_ch_encoded.length});\n`
    var font_declaration = `extern const ExGraphics::Font ${font_name};\n`;

    var file_head =
        `/** ExGraphics font file for ${base_name}
* font_name:       ${font_name_raw}
* font_size:       ${size}
* font_weight:     ${weight}
* gray_scale_bits: ${gray_scale_bits} bit(s)
* character_count: ${ch_count} character(s)
* content_size:    ${content_size} byte(s) 
*                  =${content_size / 1024} KB
* struct_size:     ${struct_size} byte(s) 
*                  =${struct_size / 1024} KB
* total_size:      ${content_size + struct_size} byte(s) 
*                  =${(content_size + struct_size) / 1024} KB
*/

`;
    var src_head =
        `#include <cstdint>
#include "Font/Font.hpp"
#include "Resource/LocalResource.hpp"
`
    var header_head =
        `#include "Font/Font.hpp"
`

    var src_text = "";
    var header_text = "";

    src_text += file_head;
    src_text += src_head;
    src_text += content_defs.join("");
    src_text += resource_defs.join("");
    src_text += character_set_def;
    src_text += font_def;

    header_text += file_head;
    header_text += header_head;
    header_text += font_declaration;

    var ret = {};
    ret['src_text'] = src_text;
    ret['header_text'] = header_text;
    ret['font_name'] = font_name_raw;
    ret['font_size'] = size;
    ret['font_weight'] = weight
    ret['gray_scale_bits'] = gray_scale_bits;
    ret['character_count'] = ch_count;
    ret['content_size'] = content_size;
    ret['struct_size'] = struct_size;
    ret['def_name'] = base_name;

    return ret;
}


function getBaseLineHeight(font) {
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.font = font;
    return ctx.measureText("").fontBoundingBoxAscent;
}

function conv(ch_str, font_name, font_size, font_weight, gray_scale_bits) {
    var font = `${font_weight} ${font_size} ${font_name}`;
    var ch_array = Array.from(new Set(Array.from(ch_str))).sort((a, b) => { return a.charCodeAt(0) - b.charCodeAt(0) });
    var gray_scale_max = (1 << gray_scale_bits) - 1;
    var arr_ch_encoded = []
    var font_ascent_height = getBaseLineHeight(font);

    ch_array.forEach((c) => {
        var dist_ch_info = {};
        ch_base_line_height = drawChar(c.toString(), font);
        dist_ch_info["char"] = c;
        dist_ch_info["offset"] = { x: 0, y: font_ascent_height - ch_base_line_height };
        gray_scale_aray = canvasToGrayScaleArray(gray_scale_max);
        dist_ch_info["size"] = { height: gray_scale_aray.length, width: gray_scale_aray[0].length };
        dist_ch_info["arr"] = encode(gray_scale_aray, gray_scale_bits);
        dist_ch_info["length"] = dist_ch_info["arr"].length
        arr_ch_encoded.push(dist_ch_info);
    });
    return generateDef(arr_ch_encoded, font_name, font_size, font_weight, gray_scale_bits);

}

// start_conv.addEventListener("click", (event) => {
//     conv(char_input.value);
// });