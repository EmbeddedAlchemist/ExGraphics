#include "GraphicsObject.hpp"

#include "ClipWindowHolder.hpp"

void ExGraphics::GraphicsObject::draw(Offset offset, GraphicsFunction &func) const {
    ClipWindowHolder clipWindowHolder(func);
    onDraw(offset, func);
    clipWindowHolder.reset(func);
}
