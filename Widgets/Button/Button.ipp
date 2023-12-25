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
inline GraphicsObject::ObjectFlags Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getFlags(void) const {
    return flags;
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline std::uint16_t Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getFocusIndex(void) const {
    return focusIndex;
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline Offset Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getOffset(void) const {
    return offset;
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline Size Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::getSize(void) const {
    return size;
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline void Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::onFocused(void) const {
    onFocusedCallback();
}

template <typename bgColorNormal, typename fgColorNormal, typename bgColorFocused, typename fgColorFocused>
inline void Button<bgColorNormal, fgColorNormal, bgColorFocused, fgColorFocused>::onActivated(void) const {
    onActivatedCallback();
}

}; // namespace ExGraphics