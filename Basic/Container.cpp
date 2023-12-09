#include "Container.hpp"

void ExGraphics::Container::onDraw(Offset offset, GraphicsFunction &func) {
    std::size_t loopCounter = elementNum;
    while(loopCounter --){
        elements[loopCounter].draw(offset, func);
    }
}