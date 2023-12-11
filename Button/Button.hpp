#pragma once

#include "Basic/GraphicsObject.hpp"

namespace ExGraphics {

template <typename bgColorNormal,
          typename fgColorNormal,
          typename bgColorFocused,
          typename fgColorFocused>
class Button : public GraphicsObject {

    static_assert(isTemplateColor<bgColorNormal>::value, "bgColorNormal must be a TemplateColor type.");
    static_assert(isTemplateColor<fgColorNormal>::value, "fgColorNormal must be a TemplateColor type.");
    static_assert(isTemplateColor<bgColorFocused>::value, "bgColorFocused must be a TemplateColor type");
    static_assert(isTemplateColor<fgColorFocused>::value, "fgColorFocused must be a TemplateColor type");

  protected:
    virtual void onDraw(Offset offset, GraphicsFunction &func) const;
    const Font &font;
    const char *text;

    CallbackFunction onFocusedCallback;
    CallbackFunction onActicatedCallback;

  public:
    constexpr Button(Offset offset,
                     Size size,
                     const Font &font,
                     const char *text,
                     CallbackFunction onFocusedCallback = nullptr,
                     CallbackFunction onActicatedCallback = nullptr,
                     ObjectFlags flags = ObjectFlags(true, true, false),
                     std::uint16_t focusIndex = 65535)
        : GraphicsObject(offset, size, flags, focusIndex),
          font(font),
          text(text),
          onFocusedCallback(onFocusedCallback),
          onActicatedCallback(onActicatedCallback) {}

    /**
     * @brief interface from GraphicsObject
     *
     * @return CallbackFunction
     */
    virtual CallbackFunction getFocusedCallback();

    /**
     * @brief interface from GraphicsObject
     *
     * @return CallbackFunction onActivatedCallback nullptr is no callback
     */
    virtual CallbackFunction getActivatedCallback();
};
} // namespace ExGraphics

#include "Button.ipp"