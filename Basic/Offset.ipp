#pragma once

#include "Offset.hpp"

namespace ExGraphics {
template <bool includeStart, bool includeEnd>
inline bool Offset::inArea(const Offset start, const Offset end) {
    bool resultStart, resultEnd;
    if (includeStart)
        resultStart = start.x <= x && start.y <= y;
    else
        resultStart = start.x < x && start.y < y;
    if (includeEnd)
        resultEnd = end.x >= x && end.y >= y;
    else
        resultEnd = end.x > x && end.y > y;
    return resultStart && resultEnd;
}
} // namespace Graphics