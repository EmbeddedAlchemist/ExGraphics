#pragma once

#include "Basic/GraphicsObject.hpp"

namespace ExGraphics {

class Button : public GraphicsObject {
  protected:
    virtual void onDraw(Offset offset, GraphicsFunction &func);
    const Font &font;
    const char *text;

  public:
};
} // namespace ExGraphics