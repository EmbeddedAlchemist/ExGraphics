#pragma once

#include <cstddef>

namespace ExGraphics {

class GraphicsObject;    

class UIFunction {
  private:
    // GraphicsObject rootContainer;
    GraphicsObject *focusedObject = nullptr;
    GraphicsObject *currContainer = nullptr;
    std::size_t elementIndex = 0;

  public:
    GraphicsObject *getFocusedObject(void);
    GraphicsObject *getFocusedContainer(void);
    std::size_t getElementIndex(void);

    void setFocus(GraphicsObject &object);
    void activate(GraphicsObject &object);
    void focusNext(void);
    void focusPrev(void);
    void activateFocused(void);
};
} // namespace ExGraphics

#include "Basic/UI/GraphicsObject.hpp"