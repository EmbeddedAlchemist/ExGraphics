#pragma once

#ifndef _GRAPHICS_DEVICE_HPP_
#define _GRAPHICS_DEVICE_HPP_

#include "Basic/Public/Size.hpp"
#include "Basic/Public/Offset.hpp"
#include <cstdint>

namespace ExGraphics {

template <typename ColorType>
class GraphicsDevice {
  public:
    virtual void update(Offset position, Size size, const ColorType *buffer) = 0;
};

} // namespace ExGraphics

#endif