#pragma once

#include <cstdint>
#include <type_traits>

namespace ExGraphics {

struct Color {
    std::uint8_t r, g, b;
    constexpr Color(std::uint8_t r, std::uint8_t g, std::uint8_t b) : r(r), g(g), b(b){};
};

template <std::uint8_t argR, std::uint8_t argG, std::uint8_t argB>
struct TemplateColor {
    static constexpr std::uint8_t r = argR;
    static constexpr std::uint8_t g = argG;
    static constexpr std::uint8_t b = argB;

    inline static Color toColor(){
        return Color(r, g, b);
    }

    inline operator Color() const {
        return Color(r, g, b);
    }
};

template <typename any>
struct isTemplateColor:std::false_type{};

template <std::uint8_t argR, std::uint8_t argG, std::uint8_t argB>
struct isTemplateColor<TemplateColor<argR, argG, argB>> : std::true_type {};

} // namespace ExGraphics