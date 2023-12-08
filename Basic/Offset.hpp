#pragma once

#include "Size.hpp"
#include <cstdint>
#include <cstdlib>

namespace ExGraphics {

class Size;

class Offset {
  public:
    std::int16_t x;
    std::int16_t y;

    constexpr Offset(std::int16_t x = 0, std::uint16_t y = 0) : x(x), y(y){};

    Offset operator+(const Offset offset) const;
    Offset operator-(const Offset offset) const;

    Offset abs(void) const;
    Offset swapXY(void) const;
    void swapXWith(Offset &offset);
    void swapYWith(Offset &offset);
    void swapWith(Offset &offset);

    Offset invertX(void) const;
    Offset invertY(void) const;
    Offset invertXY(void) const;

    template <bool includeStart = true, bool includeEnd = true>
    bool inArea(const Offset start, const Offset end);
    Size toSize() const;
};

} // namespace Graphics

#include "Offset.ipp"
