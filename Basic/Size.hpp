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

template <std::uint16_t argWidth, std::uint16_t argHeight>
class TemplateSize {
  public:
    static constexpr uint16_t width = argWidth;
    static constexpr uint16_t height = argHeight;

    inline static Size toSize() {
        return Size(width, height);
    }

    inline operator Size() const {
        return Size(width, height);
    }
};


template <typename any>
struct isTemplateSize:std::false_type{};

template <std::uint16_t argWidth, std::uint16_t argHeight>
struct isTemplateSize<TemplateSize<argWidth, argHeight>> : std::true_type {};

} // namespace ExGraphics