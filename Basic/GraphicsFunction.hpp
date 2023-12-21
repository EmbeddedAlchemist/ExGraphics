#pragma once
#include "DrawingFunction.hpp"
#include "UIFunction.hpp"
namespace ExGraphics {

class GraphicsObject;

/**
 * @brief
 * 在Graphics类中至少实现drawPixel
 * 其他绘图方法可以只依赖drawPixel完成,但是效率比较低
 * 要提高效率，可以在Graphics类中重新实现一次
 *
 */
class GraphicsFunction
    : public DrawingFunction,
      public UIFunction {
};
} // namespace ExGraphics