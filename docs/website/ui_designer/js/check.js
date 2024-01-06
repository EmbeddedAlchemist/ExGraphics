import { tinycolor } from "./tinycolor.js";
function isCppKeyword(word) {
    const keywordList = ["alignas", "alignof", "andb", "and_eqb", "asma", "auto", "bitandb", "bitorb", "bool", "break", "case", "catch", "char", "char8_t", "char16_t", "char32_t", "class", "complb", "conceptc", "const", "const_cast", "consteval", "constexpr", "constinit", "continue", "co_await", "co_return", "co_yield", "decltype", "default", "delete", "do", "double", "dynamic_cast", "else", "enum", "explicit", "exportc", "extern", "false", "float", "for", "friend", "goto", "if", "inline", "int", "long", "mutable", "namespace", "new", "noexcept", "notb", "not_eqb", "nullptr", "operator", "orb", "or_eqb", "private", "protected", "public", "register", "reinterpret_cast", "requires", "return", "short", "signed", "sizeof", "static", "static_assert", "static_cast", "struct", "switch", "template", "this", "thread_local", "throw", "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", "using", "virtual", "void", "volatile", "wchar_t", "while", "xorb", "xor_eqb",];
    if (keywordList.includes(word))
        return true;
    return false;
}
export function isCppVariantName(name) {
    if (/^[a-zA-Z_]\w*$/.test(name) != true) {
        return {
            result: false,
            reason: `"${name}" doesn't match C++ variant name format`
        };
    }
    if (isCppKeyword(name)) {
        return {
            result: false,
            reason: `"${name}" is C++ keyword`
        };
    }
    if (name == 'std') {
        return {
            result: false,
            reason: `"${name}" is C++ standard namespace`
        };
    }
    if (name.startsWith('__')) {
        return {
            result: false,
            reason: 'Names start with "__" are reserved'
        };
    }
    if (/^[\w\d]+_t$/.test(name)) {
        return {
            result: false,
            reason: 'Names end with "_t" might be a Type Name'
        };
    }
    return {
        result: true,
        reason: ""
    };
}
export function isExGraphicsVariantName(name) {
    var cppVar = isCppVariantName(name);
    if (cppVar.result != true)
        return cppVar;
    const nsName = ["ExGraphics", "ExFixedPoint"];
    if (nsName.includes(name)) {
        return {
            result: false,
            reason: `"${name}" is a namespace used by ExGraphics`
        };
    }
    return {
        result: true,
        reason: ""
    };
}
export function isColorString(input) {
    const color = tinycolor(input);
    if (color.isValid()) {
        return {
            result: true,
            reason: ""
        };
    }
    else {
        return {
            result: false,
            reason: `"${input}" is not a valid color`
        };
    }
}
