#include "GraphicsObject.hpp"
#include "Basic/Drawing/ClipWindowHolder.hpp"
#include "ExGraphicsConfig.hpp"

namespace ExGraphics {

void GraphicsObject::draw(Offset offset, GraphicsFunction &func) const {
    Offset absOffset = this->getOffset() + offset;
    Size size = this->getSize();
    if (!func.isInDrawableArea(absOffset, size))
        return;
    ClipWindowHolder clipWindowHolder(func);
    func.setClipWindow(absOffset, size);
    onDraw(absOffset, func);
    if (Configs::showObjectBorder)
        func.drawRect(absOffset, size, Color(255, 0, 255));
    clipWindowHolder.reset(func);
}

void GraphicsObject::onFocused() {
    return;
}

void GraphicsObject::onActivated() {
    return;
}

std::size_t GraphicsObject::getInnerElementCount() {
    return 0;
}

GraphicsObject *GraphicsObject::getInnerElementAt(std::size_t index) {
    (void)index;
    return nullptr;
}

GraphicsObject *GraphicsObject::getParentObject() {
    return nullptr;
}

} // namespace ExGraphics