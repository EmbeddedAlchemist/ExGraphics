#pragma once

#include "Basic/Drawing/DrawingFunction.hpp"

namespace ExGraphics {

/**
 * @brief a class to keep clip window;
 *
 */
class ClipWindowHolder {
  protected:
    const Offset offset;
    const Size size;

  public:
    ClipWindowHolder(DrawingFunction &func);
    void reset(DrawingFunction &func);
};

} // namespace ExGraphics