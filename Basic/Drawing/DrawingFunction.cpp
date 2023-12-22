#include "DrawingFunction.hpp"
#include "ExGraphicsConfig.hpp"

ExGraphics::DrawingFunction::CirclePart::CirclePart(bool topLeft, bool topRight, bool bottomLeft, bool bottomRight)
    : topLeft(topLeft), topRight(topRight), bottomLeft(bottomLeft), bottomRight(bottomRight) {
}

void ExGraphics::DrawingFunction::drawCircleHelper(Offset offset, Offset point, Color color, std::int16_t radius, CirclePart part) {
    if (part.topRight) {
        drawPixel(offset + point.invertY(), color);
        drawPixel(offset + point.invertX().swapXY(), color);
    }
    if (part.topLeft) {
        drawPixel(offset + point.invertXY(), color);
        drawPixel(offset + point.invertXY().swapXY(), color);
    }
    if (part.bottomRight) {
        drawPixel(offset + point, color);
        drawPixel(offset + point.swapXY(), color);
    }
    if (part.bottomLeft) {
        drawPixel(offset + point.invertX(), color);
        drawPixel(offset + point.invertY().swapXY(), color);
    }
}

void ExGraphics::DrawingFunction::drawCircleFilledHelper(Offset offset, Offset point, Color color, std::int16_t radius, CirclePart part) {
    if (part.topRight) {
        drawVerticalLine(offset + point.invertY(), point.y + 1, color);
        drawVerticalLine(offset + point.invertX().swapXY(), point.x + 1, color);
    }
    if (part.topLeft) {
        drawVerticalLine(offset + point.invertXY(), point.y + 1, color);
        drawVerticalLine(offset + point.invertXY().swapXY(), point.x + 1, color);
    }
    if (part.bottomRight) {
        drawVerticalLine(offset + Offset(point.x, 0), point.y + 1, color);
        drawVerticalLine(offset + Offset(point.y, 0), point.x + 1, color);
    }
    if (part.bottomLeft) {
        drawVerticalLine(offset + Offset(-point.x, 0), point.y + 1, color);
        drawVerticalLine(offset + Offset(-point.y, 0), point.x + 1, color);
    }
}

void ExGraphics::DrawingFunction::drawHorizonLine(Offset offset, std::uint16_t width, Color color) {
    drawLine(offset, offset + Offset(width, 0), color);
}

void ExGraphics::DrawingFunction::drawVerticalLine(Offset offset, std::uint16_t height, Color color) {
    drawLine(offset, offset + Offset(0, height), color);
}

void ExGraphics::DrawingFunction::drawLine(Offset start, Offset end, Color color) {
    std::int16_t x1 = start.x, y1 = start.y, x2 = end.x, y2 = end.y;
    std::int16_t tmp;
    std::int16_t x, y;
    std::int16_t dx, dy;
    std::int16_t err;
    std::int16_t ystep;
    std::int8_t swapxy = 0;

    if (x1 > x2)
        dx = x1 - x2;
    else
        dx = x2 - x1;
    if (y1 > y2)
        dy = y1 - y2;
    else
        dy = y2 - y1;

    if (dy > dx) {
        swapxy = 1;
        tmp = dx;
        dx = dy;
        dy = tmp;
        tmp = x1;
        x1 = y1;
        y1 = tmp;
        tmp = x2;
        x2 = y2;
        y2 = tmp;
    }
    if (x1 > x2) {
        tmp = x1;
        x1 = x2;
        x2 = tmp;
        tmp = y1;
        y1 = y2;
        y2 = tmp;
    }
    err = dx >> 1;
    if (y2 > y1)
        ystep = 1;
    else
        ystep = -1;
    y = y1;

    for (x = x1; x <= x2; x++) {
        if (swapxy == 0)
            drawPixel(Offset(x, y), color);
        else
            drawPixel(Offset(y, x), color);
        err -= (std::uint16_t)dy;
        if (err < 0) {
            y += (std::uint16_t)ystep;
            err += (std::uint16_t)dx;
        }
    }
}

void ExGraphics::DrawingFunction::fillRect(Offset offset, Size size, Color color) {
    Offset end = offset + size.toOffset();
    Offset curr;
    for (curr.y = offset.y; curr.y <= end.y; curr.y++)
        for (curr.x = offset.x; curr.x <= end.x; curr.x++)
            drawPixel(curr, color);
}

void ExGraphics::DrawingFunction::drawRect(Offset offset, Size size, Color color) {
    drawLine(offset, offset + Offset(size.width - 1, 0), color);
    drawLine(offset + Offset(0, size.height - 1), offset + Offset(size.width - 1, size.height - 1), color);
    drawLine(offset, offset + Offset(0, size.height - 1), color);
    drawLine(offset + Offset(size.width - 1, 0), offset + Offset(size.width - 1, size.height - 1), color);
}

void ExGraphics::DrawingFunction::fillRoundedRect(Offset offset, Size size, Color color, std::int16_t radius) {
    int16_t maxRadius = ((size.width < size.height) ? size.width : size.height) / 2;
    radius = radius > maxRadius ? maxRadius : radius < 0 ? 0
                                                         : radius;
    std::int16_t xl, yu, yl, xr, ww, hh;
    xl = offset.x + radius;
    yu = offset.y + radius;
    xr = offset.x + size.width - radius - 1;
    yl = offset.y + size.height - radius - 1;
    fillCircle(Offset(xl, yu), color, radius, CirclePart(true, false, false, false));
    fillCircle(Offset(xr, yu), color, radius, CirclePart(false, true, false, false));
    fillCircle(Offset(xl, yl), color, radius, CirclePart(false, false, true, false));
    fillCircle(Offset(xr, yl), color, radius, CirclePart(false, false, false, true));
    ww = size.width - 2 * radius;
    xl = xl + 1;
    yu = yu + 1;
    yl = yl + 1;
    if (ww >= 3) {
        ww = ww - 2;
        fillRect(Offset(xl, offset.y), Size(ww, radius + 1), color);
        fillRect(Offset(xl, yl), Size(ww, radius + 1), color);
    }
    hh = size.height - 2 * radius;
    if (hh >= 3) {
        hh = hh - 2;
        fillRect(Offset(offset.x, yu), Size(size.width, hh), color);
    }
}

void ExGraphics::DrawingFunction::drawRoundedRect(Offset offset, Size size, Color color, std::int16_t radius) {
    int16_t maxRadius = ((size.width < size.height) ? size.width : size.height) / 2;
    radius = radius > maxRadius ? maxRadius : radius < 0 ? 0
                                                         : radius;
    drawLine(offset + Offset(radius, 0),
             offset + Offset(size.width - radius, 0),
             color);
    drawLine(offset + Offset(radius, size.height - 1),
             offset + Offset(size.width - radius, size.height - 1),
             color);
    drawLine(offset + Offset(0, radius),
             offset + Offset(0, size.height - radius),
             color);
    drawLine(offset + Offset(size.width - 1, radius),
             offset + Offset(size.width - 1, size.height - radius),
             color);
    drawCircle(offset + Offset(radius, radius),
               color,
               radius,
               CirclePart(true, false, false, false));
    drawCircle(offset + Offset(size.width - radius - 1, radius),
               color,
               radius,
               CirclePart(false, true, false, false));
    drawCircle(offset + Offset(radius, size.height - radius - 1),
               color,
               radius,
               CirclePart(false, false, true, false));
    drawCircle(offset + Offset(size.width - radius - 1, size.height - radius - 1),
               color,
               radius,
               CirclePart(false, false, false, true));
}

void ExGraphics::DrawingFunction::fillCircle(Offset offset, Color color, std::uint16_t radius, CirclePart part) {
    std::int16_t f = 1 - radius;
    Offset ddF(1, -2 * radius);
    Offset cur(0, radius);
    drawCircleFilledHelper(offset, cur, color, radius, part);
    while (cur.x < cur.y) {
        if (f >= 0) {
            cur.y--;
            ddF.y += 2;
            f += ddF.y;
        }
        cur.x++;
        ddF.x += 2;
        f += ddF.x;
        drawCircleFilledHelper(offset, cur, color, radius, part);
    }
}

void ExGraphics::DrawingFunction::drawPill(Offset offset, Size size, Color color) {
    if (size.width < size.height)
        drawRect(offset, size, color);
    int radius = size.height / 2;
    if (size.height % 2 == 0) {
        drawCircle(offset + Offset(radius, radius), color, radius, CirclePart(true, false, false, false));
        drawCircle(offset + Offset(radius, radius + 1), color, radius, CirclePart(false, false, true, false));
        drawLine(offset + Offset(radius + 1, 0), offset + Offset(1 + size.width - radius, 0), color);
        drawLine(offset + Offset(radius + 1, size.height - 1), offset + Offset(1 + size.width - radius, size.height - 1), color);
        drawCircle(offset + Offset(size.width - radius - 1, radius), color, radius, CirclePart(false, true, false, false));
        drawCircle(offset + Offset(size.width - radius - 1, radius + 1), color, radius, CirclePart(false, false, false, true));

    } else {
        drawCircle(offset + Offset(radius, radius), color, radius, CirclePart(true, false, true, false));
        drawLine(offset + Offset(radius + 1, 0), offset + Offset(1 + size.width - radius, 0), color);
        drawLine(offset + Offset(radius + 1, size.height - 1), offset + Offset(1 + size.width - radius, size.height - 1), color);
        drawCircle(offset + Offset(size.width - radius - 1, radius), color, radius, CirclePart(false, true, false, true));
    }
}

void ExGraphics::DrawingFunction::fillPill(Offset offset, Size size, Color color) {
    if (size.width < size.height)
        fillRect(offset, size, color);
    int radius = size.height / 2;
    if (size.height % 2 == 0) {
        fillCircle(offset + Offset(radius, radius), color, radius, CirclePart(true, false, false, false));
        fillCircle(offset + Offset(radius, radius + 1), color, radius, CirclePart(false, false, true, false));
        fillRect(offset + Offset(radius + 1, 0), Size(size.width - 2 * radius, size.height), color);
        fillCircle(offset + Offset(size.width - radius - 1, radius), color, radius, CirclePart(false, true, false, false));
        fillCircle(offset + Offset(size.width - radius - 1, radius + 1), color, radius, CirclePart(false, false, false, true));

    } else {
        fillCircle(offset + Offset(radius, radius), color, radius, CirclePart(true, false, true, false));
        fillRect(offset + Offset(radius + 1, 0), Size(size.width - 2 * radius, size.height), color);
        fillCircle(offset + Offset(size.width - radius - 1, radius), color, radius, CirclePart(false, true, false, true));
    }
}

void ExGraphics::DrawingFunction::drawText(Offset offset, const Font &font, const char *text, Color color, std::int16_t widthLimit, TextOverflow overflowAction) {
    Offset cur = offset;
    const char *str = text;
    std::uint32_t ch;
    std::size_t chLen;
    const FontCharacter *character;
    const FontCharacter *tailing = overflowAction == TextOverflow::Ellipsis ? font.find(Configs::StringParser::nextChar("…", nullptr)) : nullptr;
    std::int16_t remainWidth = widthLimit;
    while ((ch = Configs::StringParser::nextChar(str, &chLen)) != 0) {
        str += chLen;
        character = font.find(ch);
        if (character == nullptr)
            continue;
        if(!tailing && remainWidth - character->size.width < 0){
            return;
        }
        else if(tailing && remainWidth - character->size.width < tailing->size.width){
            drawBitmap(cur + Offset(0, character->offsetY), *tailing, color);
            return;
        }
        drawBitmap(cur + Offset(0, character->offsetY), *character, color);
        cur = cur + Offset(character->size.width, 0);
        remainWidth -= character->size.width;
    }
}

std::int16_t ExGraphics::DrawingFunction::getTextWidth(const Font &font, const char *text) {
    const char *str = text;
    std::uint32_t ch;
    std::size_t chLen;
    const FontCharacter *character;
    std::uint16_t width = 0;
    while ((ch = Configs::StringParser::nextChar(str, &chLen)) != 0) {
        str += chLen;
        character = font.find(ch);
        if (character == nullptr)
            continue;
        width += character->size.width;
    }
    return width;
}

void ExGraphics::DrawingFunction::drawCircle(Offset offset, Color color, std::uint16_t radius, CirclePart part) {
    int16_t f = 1 - radius;
    Offset ddF(1, -2 * radius);
    Offset cur(0, radius);
    drawCircleHelper(offset, cur, color, radius, part);
    while (cur.x < cur.y) {
        if (f >= 0) {
            cur.y--;
            ddF.y += 2;
            f += ddF.y;
        }
        cur.x++;
        ddF.x += 2;
        f += ddF.x;
        drawCircleHelper(offset, cur, color, radius, part);
    }
}
