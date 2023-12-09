#pragma once

#include "GraphicsObject.hpp"
#include "Util/CallbackFunction.hpp"


namespace ExGraphics {
  
class GraphicsObjectFocusable : public GraphicsObject {
  protected:
    CallbackFunction &onFocusedCallback;
    CallbackFunction &onActicatedCallback;

  public:
    virtual void _onFocused() = 0;
    virtual void _onActicated() = 0;
};
} // namespace Graphics