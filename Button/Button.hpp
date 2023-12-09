#pragma once

#include "Basic/GraphicsObject.hpp"

namespace ExGraphics {

class Button : public GraphicsObject {
  protected:
    virtual void onDraw(Offset offset, GraphicsFunction &func);

  public:
};
} // namespace ExGraphics