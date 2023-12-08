#include "Text.hpp"
#include "Util/UTF8Praser.hpp"

ExGraphics::Text::Text(Offset offset, Size size, const Font &font, const char *str, Color color)
    : GraphicsObject(offset, size), font(font), str(str), color(color) {
}

void ExGraphics::Text::onDraw(Offset offset, GraphicsFunction &func) const {
    Offset cur = offset + this->offset;
    const char *str = this->str;
    std::uint32_t ch;
    std::size_t chLen;
    const FontCharacter *character;
    while ((ch = UTF8Praser::nextUTF8(str, &chLen)) != 0) {
        str += chLen;
        character = font.find(ch);
        if (character == nullptr)
            continue;
        func.drawBitmap(cur + Offset(0, character->offsetY), *character, color);
        cur = cur + Offset(character->size.width, 0);
    }
}
