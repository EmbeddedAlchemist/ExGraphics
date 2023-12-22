#include "Label.hpp"

ExGraphics::Text::Text(Offset offset, Size size, const Font &font, const char *str, Color color)
    : GraphicsObject(offset, size, GraphicsObject::ObjectFlags()),
      font(font),
      str(str),
      color(color) {
}

void ExGraphics::Text::onDraw(Offset offset, GraphicsFunction &func) const {
    func.drawText(offset, font, str, color);
}
