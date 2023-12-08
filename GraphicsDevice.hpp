#pragma once

#ifndef _GRAPHICS_DEVICE_HPP_
#define _GRAPHICS_DEVICE_HPP_

#include "Basic/Offset.hpp"
#include "Basic/Size.hpp"
#include <cstdint>

namespace ExGraphics {

template <typename ColorType>
class GraphicsDevice {
  public:
    virtual void update(Offset position, Size size, const ColorType *buffer) = 0;
};

} // namespace Graphics

#endif