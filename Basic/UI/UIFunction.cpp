#include "UIFunction.hpp"

namespace ExGraphics {

GraphicsObject *UIFunction::getFocusedObject(void) {
    return focusedObject;
}

GraphicsObject *UIFunction::getFocusedContainer(void) {
    return currContainer;
}

std::size_t UIFunction::getElementIndex(void) {
    return elementIndex;
}

}; // namespace ExGraphics