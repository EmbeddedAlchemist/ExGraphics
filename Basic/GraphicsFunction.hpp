#pragma once

#include "Bitmap.hpp"
#include "GraphicsObject.hpp"
#include "Offset.hpp"
#include "Size.hpp"

#include "Util/Color/Color.hpp"

namespace ExGraphics {
    
class GraphicsObject;

/**
 * @brief
 * 在Graphics类中至少实现drawPixel
 * 其他绘图方法可以只依赖drawPixel完成,但是效率比较低
 * 要提高效率，可以在Graphics类中重新实现一次
 *
 */
class GraphicsFunction {
  public:
    struct CirclePart {
        bool topLeft : 1;
        bool topRight : 1;
        bool bottomLeft : 1;
        bool bottomRight : 1;
        CirclePart(bool topLeft, bool topRight, bool bottomLeft, bool bottomRight);
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
    virtual void drawRectFilled(Offset offset, Size size, Color color);
    virtual void drawRect(Offset offset, Size size, Color color);
    virtual void drawRRectFilled(Offset offset, Size size, Color color, std::int16_t radius);
    virtual void drawRRect(Offset offset, Size size, Color color, std::int16_t radius);
    virtual void drawCircleFilled(Offset offset, Color color, std::uint16_t radius, CirclePart part = CirclePart(true, true, true, true));
    virtual void drawCircle(Offset offset, Color color, std::uint16_t radius, CirclePart part = CirclePart(true, true, true, true));

    // bitmap drawing
    virtual void drawBitmap(Offset offset, const MonoBitmap &bitmap, Color color) = 0;

    // drawing control
    virtual bool isInDrawableArea(Offset offset, Size size) = 0;
    virtual void setClipWindow(Offset offset, Size size) = 0;
    virtual void getClipWindow(Offset &offset, Size &size) = 0;
    virtual void resetClipWindow() = 0;
};
} // namespace ExGraphics