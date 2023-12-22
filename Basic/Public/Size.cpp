#include "Size.hpp"

namespace ExGraphics {


std::size_t Size::getArea(void) const {
    return width * height;
}
Size Size::operator+(Offset offset) const {
    return Size(width + offset.x, height + offset.y);
}
Offset Size::toOffset() const {
    return Offset(width - 1, height - 1);
}
} // namespace Graphics
