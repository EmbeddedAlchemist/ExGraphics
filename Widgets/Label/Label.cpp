#include "Label.hpp"

namespace ExGraphics {

GraphicsObject::ObjectFlags Label::getFlags(void) const {
    return flags;
}

std::uint16_t Label::getFocusIndex(void) const {
    return 65535;
}

Offset Label::getOffset(void) const {
    return offset;
}

Size Label::getSize(void) const {
    return size;
}

void Label::onDraw(Offset offset, GraphicsFunction &func) const {
    func.drawText(offset, font, str, color);
}

} // namespace ExGraphics