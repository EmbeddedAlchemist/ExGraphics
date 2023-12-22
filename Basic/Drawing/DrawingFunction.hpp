#pragma once

#include "Basic/Public/Bitmap.hpp" 
#include "Basic/Public/Color.hpp"
#include "Basic/Public/Font.hpp"
#include "Basic/Public/Offset.hpp"
#include "Basic/Public/Size.hpp"

namespace ExGraphics{
class DrawingFunction{
      public:
    struct CirclePart {
        bool topLeft : 1;
        bool topRight : 1;
        bool bottomLeft : 1;
        bool bottomRight : 1;
        CirclePart(bool topLeft, bool topRight, bool bottomLeft, bool bottomRight);
    };

    enum class TextOverflow {
        Ellipsis,
        Cut
    };

  private:
    void drawCircleHelper(Offset offset, Offset point, Color color, std::int16_t radius, CirclePart part);
    void drawCircleFilledHelper(Offset offset, Offset point, Color color, std::int16_t radius, CirclePart part);
    void drawHorizonLine(Offset offset, std::uint16_t width, Color color);
    void drawVerticalLine(Offset offset, std::uint16_t height, Color color);

  public:
    // basic drawing
    virtual void drawPixel(Offset offset, Color color) = 0;
    virtual void drawLine(Offset start, Offset end, Color color);
    virtual void fillRect(Offset offset, Size size, Color color);

    // bitmap drawing
    virtual void drawBitmap(Offset offset, const MonoBitmap &bitmap, Color color) = 0;

    // extra drawing
    virtual void drawRect(Offset offset, Size size, Color color);
    virtual void drawRoundedRect(Offset offset, Size size, Color color, std::int16_t radius);
    virtual void fillRoundedRect(Offset offset, Size size, Color color, std::int16_t radius);
    virtual void drawCircle(Offset offset, Color color, std::uint16_t radius, CirclePart part = CirclePart(true, true, true, true));
    virtual void fillCircle(Offset offset, Color color, std::uint16_t radius, CirclePart part = CirclePart(true, true, true, true));
    virtual void drawPill(Offset offset, Size size, Color color);
    virtual void fillPill(Offset offset, Size size, Color color);

    // text
    void drawText(Offset offset, const Font &font, const char *text, Color color, std::int16_t widthLimit = 32767, TextOverflow overflowAction = TextOverflow::Ellipsis);
    std::int16_t getTextWidth(const Font &font, const char *text);

    // drawing control
    virtual bool isInDrawableArea(Offset offset, Size size) = 0;
    virtual void setClipWindow(Offset offset, Size size) = 0;
    virtual void getClipWindow(Offset &offset, Size &size) = 0;
    virtual void resetClipWindow() = 0;
};
};