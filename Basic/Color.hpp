#pragma once

#include <cstdint>

namespace ExGraphics {

struct Color {
    std::uint8_t r, g, b;
    Color(std::uint8_t r, std::uint8_t g, std::uint8_t b);
};

} // namespace ExGraphics