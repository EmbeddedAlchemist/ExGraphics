#include "GraphicsObject.hpp"
#include "ClipWindowHolder.hpp"
#include "ExGraphicsConfig.hpp"

namespace ExGraphics {

void GraphicsObject::draw(Offset offset, GraphicsFunction &func) const {
    Offset absOffset = this->offset + offset;
    if (!func.isInDrawableArea(absOffset, size))
        return;
    ClipWindowHolder clipWindowHolder(func);
    func.setClipWindow(absOffset, this->size);
    onDraw(absOffset, func);
    if (Configs::showObjectBorder)
        func.drawRect(absOffset, size, Color(255, 0, 255));
    clipWindowHolder.reset(func);
}

CallbackFunction GraphicsObject::getFocusedCallback() {
    return nullptr;
}

CallbackFunction GraphicsObject::getActivatedCallback() {
    return nullptr;
}

std::size_t GraphicsObject::getInnerElementCount() {
    return 0;
}

GraphicsObject *GraphicsObject::getInnerElementAt(std::size_t index) {
    (void)index;
    return nullptr;
}

} // namespace ExGraphics