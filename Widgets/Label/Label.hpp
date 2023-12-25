#pragma once

#include "Basic/Public/Font.hpp"
#include "Basic/UI/GraphicsObject.hpp"

namespace ExGraphics {

class Label : public GraphicsObject {
  protected:
    const Font &font;
    const char *str;
    Color color;

  public:
    constexpr Label(Offset offset, Size size, const Font &font, const char *str, Color color)
        : offset(offset),
          size(size),
          flags(false,false,false),
          font(font),
          str(str),
          color(color){};

    ObjectFlags flags;
    Offset offset;
    Size size;
    
    virtual ObjectFlags getFlags(void) const;
    virtual std::uint16_t getFocusIndex(void) const;
    virtual Offset getOffset(void) const;
    virtual Size getSize(void) const;
    virtual void onDraw(Offset offset, GraphicsFunction &func) const;
};

} // namespace ExGraphics