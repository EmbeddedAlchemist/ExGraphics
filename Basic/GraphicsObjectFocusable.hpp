#pragma once

#include "GraphicsObject.hpp"
#include "Util/CallbackFunction.hpp"


namespace ExGraphics {
template <typename ColorType>
class GraphicsObjectFocusable : public GraphicsObject<ColorType> {
  protected:
    CallbackFunction &onFocusedCallback;
    CallbackFunction &onActicatedCallback;

  public:
    virtual void _onFocused() = 0;
    virtual void _onActicated() = 0;
};
} // namespace Graphics