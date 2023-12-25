#pragma once


#include "Basic/Public/CallbackFunction.hpp"
#include "Basic/UI/GraphicsObject.hpp"



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
    CallbackFunction onActivatedCallback;

  public:
    constexpr Button(Offset offset,
                     Size size,
                     const Font &font,
                     const char *text,
                     CallbackFunction onFocusedCallback = CallbackFunction(nullptr),
                     CallbackFunction onActicatedCallback = CallbackFunction(nullptr),
                     ObjectFlags flags = ObjectFlags(true, true, false),
                     std::uint16_t focusIndex = 65535)
        : offset(offset),
          size(size),
          flags(flags),
          focusIndex(focusIndex),
          font(font),
          text(text),
          onFocusedCallback(onFocusedCallback),
          onActivatedCallback(onActicatedCallback) {}

    ObjectFlags flags;
    std::uint16_t focusIndex;
    Offset offset;
    Size size;
    virtual ObjectFlags getFlags(void) const;
    virtual std::uint16_t getFocusIndex(void) const;
    virtual Offset getOffset(void) const;
    virtual Size getSize(void) const;

    /**
     * @brief interface from GraphicsObject
     *
     * @return CallbackFunction
     */
    virtual void onFocused(void) const;

    /**
     * @brief interface from GraphicsObject
     *
     * @return CallbackFunction onActivatedCallback nullptr is no callback
     */
    virtual void onActivated(void) const;
};
} // namespace ExGraphics

#include "Button.ipp"