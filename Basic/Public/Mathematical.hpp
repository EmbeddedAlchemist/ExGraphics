#include "Basic/Public/Offset.hpp"
#include "ExFixedPoint.hpp"

namespace ExGraphics {

using ExFixedPoint::FastFixed_16_16;

class Mathematical {

  public:
    static FastFixed_16_16 findLineYAtX(Offset start, Offset end, std::int16_t x);
    static FastFixed_16_16 findLineXAtY(Offset start, Offset end, std::int16_t y);
    static void findIntersectionsOfLineAndRect(Offset lineStart, Offset lineEnd, Offset rectStart, Size rectSize);
};

} // namespace ExGraphics