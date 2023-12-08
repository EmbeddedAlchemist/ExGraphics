#include "Offset.hpp"

namespace ExGraphics {

Offset Offset::operator+(const Offset offset) const {
    return Offset(this->x + offset.x, this->y + offset.y);
}

Offset Offset::operator-(const Offset offset) const {
    return Offset(this->x - offset.x, this->y - offset.y);
}

Offset Offset::abs(void) const {
    return Offset(x > 0 ? x : -x, y > 0 ? y : -y);
}

Offset Offset::swapXY(void) const {
    return Offset(y, x);
}

void Offset::swapXWith(Offset &offset) {
    this->x = this->x ^ offset.x;
    offset.x = this->x ^ offset.x;
    this->x = this->x ^ offset.x;
}

void Offset::swapYWith(Offset &offset) {
    this->y = this->y ^ offset.y;
    offset.y = this->y ^ offset.y;
    this->y = this->y ^ offset.y;
}

void Offset::swapWith(Offset &offset) {
    Offset tmp = offset;
    offset = *this;
    *this = tmp;
}

Offset Offset::invertX(void) const {
    return Offset(-x, y);
}

Offset Offset::invertY(void) const {
    return Offset(x, -y);
}

Offset Offset::invertXY(void) const {
    return Offset(-x, -y);
}

Size Offset::toSize() const {
    return Size(x < 0 ? 0 : x + 1,
                y < 0 ? 0 : y + 1);
}

} // namespace ExGraphics