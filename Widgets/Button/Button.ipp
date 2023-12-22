#include "Button.hpp"

namespace ExGraphics {
template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline void Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::onDraw(Offset offset, GraphicsFunction &func) const {
    func.fillPill(offset, size, bgColorNormal::toColor());
    Offset textOffset(
        ((std::int16_t)size.width - func.getTextWidth(font, text)) / 2,
        ((std::int16_t)size.height - font.ascentHeight) / 2);
    if (textOffset.x < 0)
        textOffset.x = 0;
    func.drawText(offset + textOffset, font, text, fgColorNormal::toColor(), size.width);
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline CallbackFunction Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getFocusedCallback() {
    return onFocusedCallback;
}
template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline CallbackFunction Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getActivatedCallback() {
    return onActicatedCallback;
}
}; // namespace ExGraphics