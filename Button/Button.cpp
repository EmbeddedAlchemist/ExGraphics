#include "Button.hpp"


void ExGraphics::Button::onDraw(Offset offset, GraphicsFunction &func) {
    func.fillPill(offset, size, Color(255, 255, 255));
}
