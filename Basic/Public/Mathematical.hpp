#include "Basic/Public/Offset.hpp"
#include "ExFixedPoint.hpp"

namespace ExGraphics {

using ExFixedPoint::FastFixed_16_16;

class Mathematical {

  public:
    /**
     * @brief 求解指定直线x坐标为x时的y值
     * 
     * @param start 
     * @param end 
     * @param x 
     * @return FastFixed_16_16 
     */
    static FastFixed_16_16 findLineYAtX(Offset start, Offset end, std::int16_t x);
    static FastFixed_16_16 findLineXAtY(Offset start, Offset end, std::int16_t y);

    /**
     * @brief 该函数用于查找直线和矩形的交点，还未实现，参数和返回值需要斟酌
     * 
     * @param lineStart 
     * @param lineEnd 
     * @param rectStart 
     * @param rectSize 
     */
    static void findIntersectionsOfLineAndRect(Offset lineStart, Offset lineEnd, Offset rectStart, Size rectSize);
};

} // namespace ExGraphics