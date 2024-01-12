/**
 * @file DrawingOptimise.ipp
 * @author your name (you@domain.com)
 * @brief 该文件中的函数都是从GraphicsFunction中继承的虚函数接口
 * @version 0.1
 * @date 2024-01-10
 *  
 * 由于此处更接近绘图缓存，在此处实现函数可以优化速度，
 * 但是在绘制前需要做好各种形式的判断，以免越界或绘制错误
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#pragma once

#include "Basic/Public/Mathematical.hpp"
#include "ExFixedPoint.hpp"
#include "Graphics.hpp"

/**
 * @brief
 * These functions are virtual function interfacesin
 * in the class Graphics herited from DrawingFunction,
 * which allows for greater optimization,
 * due to being more low-level
 */

namespace ExGraphics {

template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::drawHorizonLine(Offset start, Offset end, ColorType color) {
    debugAssert(start.y == end.y);
    if (start.x > end.x)
        start.swapXWith(end);
    if (!containDrawableArea(start, Size(end.x - start.x + 1, end.y - start.y + 1)))
        return;
    start = limitAtDrawableArea(start);
    end = limitAtDrawableArea(end);
    start = toPageOffset(start);
    end = toPageOffset(end);
    while (start.x <= end.x) {
        setPixel(start, color);
        start.x++;
    }
}

template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::drawVerticalLine(Offset start, Offset end, ColorType color) {
    debugAssert(start.x == end.x);
    if (start.y > end.y)
        start.swapYWith(end);
    if (!containDrawableArea(start, Size(end.x - start.x + 1, end.y - start.y + 1)))
        return;
    start = limitAtDrawableArea(start);
    end = limitAtDrawableArea(end);
    start = toPageOffset(start);
    end = toPageOffset(end);
    while (start.y <= end.y) {
        setPixel(start, color);
        start.y++;
    }
}

template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::drawPixel(Offset offset, Color _color) {
    if (!inDrawableArea(offset))
        return;
    ColorType color(_color);
    setPixel(toPageOffset(offset), color);
}
template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::drawLine(Offset start, Offset end, Color _color) {
    ColorType color(_color);
    if (start.y == end.y)
        return drawHorizonLine(start, end, color);
    else if (start.x == end.x)
        return drawVerticalLine(start, end, color);
    GraphicsFunction::drawLine(start, end, _color);

    //FastFixed_16_16 Mathematical::findLineXAtY(start, end, )
}
template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::fillRect(Offset start, Size size, Color _color) {
    if (!containDrawableArea(start, size))
        return;
    Offset end = start + size.toOffset();
    ColorType color(_color);
    start = limitAtDrawableArea(start);
    start = toPageOffset(start);
    end = limitAtDrawableArea(end);
    end = toPageOffset(end);
    Offset curr = start;
    for (curr.y = start.y; curr.y <= end.y; curr.y++)
        for (curr.x = start.x; curr.x <= end.x; curr.x++)
            setPixel(curr, color);
}

template <typename ColorType, typename displaySize, typename pageSize>
inline void Graphics<ColorType, displaySize, pageSize>::drawBitmap(Offset offset, const MonoBitmap &_bitmap, Color _color) {
    if (!containDrawableArea(offset, _bitmap.size)) // check if there is a part of the bitmap in drawable area
        return;                                     // if not, return.

    Offset drawStart = limitAtDrawableArea(offset); // calculate the start position of canvas to draw;
    Offset drawEnd = limitAtDrawableArea(offset + _bitmap.size.toOffset());
    Size drawSize = (drawEnd - drawStart).toSize();
    Offset bitmapStart = drawStart - offset; // calculate the start position of the bitmap to draw
    drawStart = toPageOffset(drawStart);     // map position to page buffer position
    drawSize = Size(bitmapStart.x + drawSize.width > _bitmap.size.width ? _bitmap.size.width - bitmapStart.x : drawSize.width,
                    bitmapStart.y + drawSize.height > _bitmap.size.height ? _bitmap.size.height - bitmapStart.y : drawSize.height);

    ActivatedMonoBitmap bitmap = _bitmap.activate(); // fetch bitmap;
    ColorType color(_color);
    Offset cur;
    if (bitmap.grayScaleBits == 1) {
        for (cur.y = 0; cur.y < drawSize.height; cur.y++) {
            cur.x = 0;
            bitmap.seqGetStart(bitmapStart + cur);
            for (; cur.x < drawSize.width; cur.x++) {
                if (bitmap.seqGetPixel() != 0) {
                    setPixel(drawStart + cur, color);
                }
            }
        }
    } else {
        std::uint8_t grayScaleMax = (1u << bitmap.grayScaleBits) - 1;
        for (cur.y = 0; cur.y < drawSize.height; cur.y++) {
            cur.x = 0;
            bitmap.seqGetStart(bitmapStart + cur);
            for (; cur.x < drawSize.width; cur.x++) {
                ColorType &pix = getPixelRef(drawStart + cur);
                pix = pix.mix(color, std::numeric_limits<std::uint8_t>::max() * bitmap.seqGetPixel() / grayScaleMax);
            }
        }
    }
}

}; // namespace ExGraphics