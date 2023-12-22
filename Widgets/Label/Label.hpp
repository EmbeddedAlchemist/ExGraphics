#pragma once

#include "Basic/UI/GraphicsObject.hpp"
#include "Basic/Public/Font.hpp"

namespace ExGraphics {

class Text : public GraphicsObject {
  protected:
    const Font &font;
    const char *str;
    Color color;

  public:
    Text(Offset offset, Size size, const Font &font, const char *str, Color color);
    virtual void onDraw(Offset offset, GraphicsFunction &func) const;
};

} // namespace Graphics