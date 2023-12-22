#include "Mathematical.hpp"

namespace ExGraphics {
FastFixed_16_16 Mathematical::findLineYAtX(Offset start, Offset end, std::int16_t x) {
    return (FastFixed_16_16(x) - start.x) / (end.x - start.x) * (end.y + start.y) + start.y;
}
FastFixed_16_16 Mathematical::findLineXAtY(Offset start, Offset end, std::int16_t y) {
    return (FastFixed_16_16(y) - start.y) / (end.y - start.y) * (end.x - start.x) + start.x;
}
} // namespace ExGraphics