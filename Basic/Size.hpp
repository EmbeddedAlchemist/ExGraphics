#pragma once

#include <cstddef>
#include <cstdint>

#include "Offset.hpp"

namespace ExGraphics {

class Offset;

class Size {
  public:
    std::uint16_t width;
    std::uint16_t height;

    constexpr Size(std::uint16_t width = 0, std::uint16_t height = 0) : width(width), height(height){};
    std::size_t getArea(void) const;
    Size operator+(Offset offset) const;

    Offset toOffset() const;
};
} // namespace Graphics