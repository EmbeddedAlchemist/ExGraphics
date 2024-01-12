#pragma once

#include "Basic/Public/Offset.hpp"
#include "Basic/Public/Color.hpp"
#include "Basic/Interface/GraphicsDevice.hpp"
#include "Basic/Interface/GraphicsFunction.hpp"


namespace ExGraphics {

/**
 * @brief 该类是各项功能的聚合，一般一个图形设备对应一个Graphics类
 *  
 * @tparam ColorType Color type for graophics. e.g. RGB565
 * @tparam displayWidth
 * @tparam displayHeight
 * @tparam pageWidth
 * @tparam pageHeight
 */
template <typename ColorType, typename displaySize, typename pageSize>
class Graphics : public GraphicsFunction {

    static_assert(isTemplateSize<displaySize>::value, "displaySize must be a TemplateSize");
    static_assert(isTemplateSize<pageSize>::value, "pageSize must be a TemplateSize");

  protected:

    /**
     * @brief drawing buffer
     *
     */
  ColorType buffer[pageSize::height][pageSize::width];

    /**
     * @brief a reference to graphics device
     *
     */
    GraphicsDevice<ColorType> &graphicsDevice;

    /**
     * @brief current page offset from display zero point.
     *
     */
    Offset pageOffset;

    /**
     * @brief window clip start (included)
     *
     */
    Offset clipStart;

    /**
     * @brief window clip end (not included)
     *
     */
    Offset clipEnd;

    //
    //
    //
    //
    //
    // Safe checking functions
    //

    /**
     * @brief check if the position in display area
     *
     * @param offset offset from display zero point
     * @return true
     * @return false
     */
    bool inDisplayArea(Offset offset);

    bool inPageArea(Offset offset);
    bool inWindowArea(Offset offset);

    /**
     * @brief check if the position in drawable area
     *
     * @param offset offset from display zero point
     * @return true
     * @return false
     */
    bool inDrawableArea(Offset offset);

    bool containPageArea(Offset offset, Size size);
    bool containWindowArea(Offset offset, Size size);

    /**
     * @brief check if a rectangle which offset is "offset" and size is "size" has a part in drawable area
     *
     * @param offset offset from display zero point
     * @param size
     * @return true
     * @return false
     */
    bool containDrawableArea(Offset offset, Size size);

    /**
     * @brief limit offset in display area
     *
     * @param offset raw offset
     * @return Offset limited offset
     */
    Offset limitAtDisplayArea(Offset offset);

    /**
     * @brief
     *
     * @param offset
     * @return Offset
     */
    Offset limitAtPageArea(Offset offset);

    /**
     * @brief
     *
     * @param offset
     * @return Offset
     */
    Offset limitAtWindowArea(Offset offset);

    /**
     * @brief limit offset in drawable area
     *
     * @param offset raw offset
     * @return Offset limited offset
     */
    Offset limitAtDrawableArea(Offset offset);

    /**
     * @brief convert display offset to page offset
     *
     * @param offset display offset
     * @return Offset page offset
     */
    Offset toPageOffset(Offset offset);

    //
    //
    //
    //
    //
    // pixel operating functions
    //

    /**
     * @brief draw pixel method without check, better performance.
     * set pixel color in buffer.
     * make sure that offset is in drawable area, function will not check offset errors.
     * a draw outsize the drawable area might cause a segment error.
     *
     * @param pagePosition offset from pageOffset. ** Not from display zero point **
     * @param color color to draw
     */
    void setPixel(Offset pagePosition, ColorType color);

    /**
     * @brief get pixel at position from page buffer.
     * get pixel from buffer
     * make sure that offset is in drawable area, function will not check offset errors.
     *
     * @param pagePosition offset from pageOffset. ** Not from display zero point **
     * @return ColorType
     */
    ColorType getPixel(Offset pagePosition);

    /**
     * @brief get pixel reference from page buffer
     *
     * @param pagePosition offset from pageOffset. ** Not from display zero point **
     * @return ColorType&
     */
    ColorType &getPixelRef(Offset pagePosition);

    //
    //
    //
    //
    //
    // Helper functions
    //

    /**
     * @brief draw Horizon line with better performance
     *
     * @param offset
     * @param width
     * @param color
     */
    void drawHorizonLine(Offset start, Offset end, ColorType color);

    /**
     * @brief draw vertical line with better performance
     *
     * @param offset
     * @param width
     * @param color
     */
    void drawVerticalLine(Offset start, Offset end, ColorType color);



      //

    //


    //
    //
    //
    //
    //
    // window clip
    //

    //
    //
    //
    //
    //
    // public function:
    //

  public:
    /**
     * @brief Construct a new Graphics object
     *
     * @param graphicsDevice a graphics device that drive the screen, ColorType must as same as Grapphics ColorType
     */
    Graphics(GraphicsDevice<ColorType> &graphicsDevice);
    void fill(ColorType color);
    void clear();
    void update();

    //
    //
    //
    //
    //
    // draw interface from GraphicsFunction. Hot funtion could implement in this class for better performance.
    //

    /**
     * @brief draw pixel method.
     * This method is a interface of GraphicsFunction.
     * Offset will be checked before drawing, means that a lower performances.
     * if sured that position to draw is in drawable area, use setPixel(Offset, ColorType) instead.
     *
     * @param offset offset from display zero point.
     * @param color color to draw
     */
    virtual void drawPixel(Offset offset, Color color);

    /**
     * @brief
     *
     * @param start
     * @param end
     * @param color
     */
    virtual void drawLine(Offset start, Offset end, Color color);

    /**
     * @brief draw filled rectangle method
     *
     * @param offset offset from display zero point.
     * @param size rectangle size
     * @param color fill color
     */
    virtual void fillRect(Offset offset, Size size, Color color);

    /**
     * @brief draw mono bitmap method
     *
     * @param offset
     * @param bitmap
     * @param color
     */
    virtual void drawBitmap(Offset offset, const MonoBitmap &bitmap, Color color);

    virtual bool isInDrawableArea(Offset offset, Size size);
    virtual void setClipWindow(Offset offset, Size size);
    virtual void getClipWindow(Offset &offset, Size &size);
    virtual void resetClipWindow();

    //
    //
    //
    //
    //
    // Page control methods
    //

    /**
     * @brief reset the page buffer to first page;
     *
     */
    void firstPage(void);

    /**
     * @brief prepare to draw next page
     *
     * @return true Not last page. Page buffer will move to next page to draw, keep drawing
     * @return false This is the last page to draw. Page buffer will not move. Call firstPage() to reset page buffer position;
     */
    bool nextPage(void);
};

} // namespace ExGraphics

#include "Graphics.ipp"
#include "DrawingOptimise.ipp"