#pragma once

#include <cstdint>
#include <numeric>

namespace ExGraphics {
class Focusable {
  public:
    std::uint16_t index;

    static constexpr std::uint16_t Unfocusable = 65535;

    constexpr Focusable(std::uint16_t focusIndex) : index(focusIndex){};
    bool focusable(void);
};
} // namespace ExGraphics