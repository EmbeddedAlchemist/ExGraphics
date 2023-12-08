#pragma once

#include "GraphicsFunction.hpp"

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
    ClipWindowHolder(GraphicsFunction &func);
    void reset(GraphicsFunction &func);
};

} // namespace ExGraphics