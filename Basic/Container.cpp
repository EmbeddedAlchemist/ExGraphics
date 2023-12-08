#include "Container.hpp"

void ExGraphics::Container::onDraw(Offset offset, GraphicsFunction &func) {
    std::size_t loopCounter = elementNum;
    Offset absOffset = this->offset + offset;
    while(loopCounter --){
        elements[loopCounter].draw(absOffset, func);
    }
}