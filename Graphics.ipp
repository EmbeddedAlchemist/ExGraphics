#pragma once

#include "Basic/GraphicsFunction.hpp"
#include "Graphics.hpp"
#include "debug.hpp"
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <numeric>

namespace ExGraphics {

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::inDisplayArea(Offset offset) {
    return offset.inArea<true, false>(Offset(0, 0), Offset(displayWidth, displayHeight));
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::inPageArea(Offset offset) {
    return offset.inArea<true, false>(pageOffset, pageOffset + Offset(pageWidth, pageHeight));
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::inWindowArea(Offset offset) {
    return offset.inArea<true, false>(clipStart, clipEnd);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::inDrawableArea(Offset offset) {
    return inPageArea(offset) &&
           inWindowArea(offset) &&
           inDisplayArea(offset);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::containPageArea(Offset targetStart, Size size) {
    Offset pageEnd = pageOffset + Offset(pageWidth - 1, pageHeight - 1),
           targetEnd = targetStart + size.toOffset();
    return pageEnd.y > targetStart.y &&
           pageOffset.y <= targetEnd.y &&
           pageEnd.x > targetStart.x &&
           pageOffset.x <= targetEnd.x;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::containWindowArea(Offset targetStart, Size size) {
    Offset targetEnd = targetStart + size.toOffset();
    return clipEnd.y > targetStart.y &&
           clipStart.y <= targetEnd.y &&
           clipEnd.x > targetStart.x &&
           clipStart.x <= targetEnd.x;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::containDrawableArea(Offset offset, Size size) {
    return containPageArea(offset, size) &&
           containWindowArea(offset, size);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline Offset Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::limitAtDisplayArea(Offset offset) {
    if (offset.x < 0)
        offset.x = 0;
    else if (offset.x >= displayWidth)
        offset.x = displayWidth - 1;
    if (offset.y < 0)
        offset.y = 0;
    else if (offset.y >= displayHeight)
        offset.y = displayHeight - 1;
    return offset;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline Offset Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::limitAtPageArea(Offset offset) {
    if (offset.x < pageOffset.x)
        offset.x = pageOffset.x;
    else if (offset.x >= pageOffset.x + pageWidth)
        offset.x = pageOffset.x + pageWidth - 1;
    if (offset.y < pageOffset.y)
        offset.y = pageOffset.y;
    else if (offset.y >= pageOffset.y + pageHeight)
        offset.y = pageOffset.y + pageHeight - 1;
    return offset;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline Offset Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::limitAtWindowArea(Offset offset) {
    if (offset.x < clipStart.x)
        offset.x = clipStart.x;
    else if (offset.x >= clipEnd.x)
        offset.x = clipEnd.x - 1;
    if (offset.y < clipStart.y)
        offset.y = clipStart.y;
    else if (offset.y >= clipEnd.y)
        offset.y = clipEnd.y - 1;
    return offset;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline Offset Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::limitAtDrawableArea(Offset offset) {
    offset = limitAtDisplayArea(offset);
    offset = limitAtPageArea(offset);
    offset = limitAtWindowArea(offset);
    return offset;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline Offset Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::toPageOffset(Offset offset) {
    return offset - pageOffset;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::Graphics(GraphicsDevice<ColorType> &graphicsDevice)
    : graphicsDevice(graphicsDevice), pageOffset(0, 0), clipStart(0, 0), clipEnd(displayWidth, displayHeight) {
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::fill(ColorType color) {
    size_t size = pageWidth * pageHeight;
    ColorType *pix = &buffer[0][0];
    while (size--) {
        *pix = color;
        pix++;
    }
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::clear() {
    std::memset(&buffer[0][0], 0xFF, sizeof(buffer));
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::update() {
    graphicsDevice.update(pageOffset, Size(pageWidth, pageHeight), &buffer[0][0]);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::setPixel(Offset position, ColorType color) {
    debugAssert(inDrawableArea(position + pageOffset));
    buffer[position.y][position.x] = color;
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
ColorType Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::getPixel(Offset position) {
    return buffer[position.y][position.x];
}
template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline ColorType &Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::getPixelRef(Offset position) {
    debugAssert(inDrawableArea(position + pageOffset));
    return buffer[position.y][position.x];
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::drawHorizonLine(Offset start, Offset end, ColorType color) {
    debugAssert(start.y == end.y);
    if(start.x > end.x)
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

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::drawVerticalLine(Offset start, Offset end, ColorType color) {
    debugAssert(start.x == end.x);
    if(start.y > end.y)
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

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::drawPixel(Offset offset, Color _color) {
    if (!inDrawableArea(offset))
        return;
    ColorType color(_color);
    setPixel(toPageOffset(offset), color);
}
template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::drawLine(Offset start, Offset end, Color _color) {
    ColorType color(_color);
    if (start.y == end.y)
        drawHorizonLine(start, end, color);
    if (start.x == end.x)
        drawVerticalLine(start, end, color);
    else
        GraphicsFunction::drawLine(start, end, _color);
}
template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::fillRect(Offset start, Size size, Color _color) {
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

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::drawBitmap(Offset offset, const MonoBitmap &_bitmap, Color _color) {
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
                ColorType &ref = getPixelRef(drawStart + cur);
                ref = ref.mix(color, std::numeric_limits<std::uint8_t>::max() * bitmap.seqGetPixel() / grayScaleMax);
            }
        }
    }
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::isInDrawableArea(Offset offset, Size size) {
    return containDrawableArea(offset, size);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::setClipWindow(Offset offset, Size size) {
    clipStart = offset;
    clipEnd = offset + Offset(size.width, size.height);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::getClipWindow(Offset &offset, Size &size) {
    offset = clipStart;
    size = Size(clipEnd.x - clipStart.x, clipEnd.y - clipStart.y);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::resetClipWindow() {
    clipStart = Offset(0, 0);
    clipEnd = Offset(displayWidth, displayHeight);
}

template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline void Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::firstPage(void) {
    pageOffset = Offset(0, 0);
}
template <typename ColorType, std::uint16_t displayWidth, std::uint16_t displayHeight, std::uint16_t pageWidth, std::uint16_t pageHeight>
inline bool Graphics<ColorType, displayWidth, displayHeight, pageWidth, pageHeight>::nextPage(void) {
    Offset bkup = pageOffset;
    pageOffset.x += pageWidth;
    if (pageOffset.x < displayWidth)
        return true;
    pageOffset.x = 0;
    pageOffset.y += pageHeight;
    if (pageOffset.y < displayHeight)
        return true;
    pageOffset = bkup; // keep pageoffset;
    return false;
}

} // namespace ExGraphics
