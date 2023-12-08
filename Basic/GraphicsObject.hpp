#pragma once

#include "GraphicsFunction.hpp"
#include "Focusable.hpp"
#include "Graphics.hpp"
#include "Offset.hpp"
#include "Size.hpp"

namespace ExGraphics {

class GraphicsObject {
  protected:
    /**
     * @brief middle function to draw this object.
     * DO NOT CALL THIS FUNCTION DIRECTLY, to draw the object, call draw(Offset, GraphicsFunction&) indead;
     * subClass should implement this function.
     * in this function, you should use methon that &func provides to draw self.
     *
     * @param offset offset to parent object
     * @param func graphics function interface
     */
    virtual void onDraw(Offset offset, GraphicsFunction &func) const = 0;

  public:
    constexpr GraphicsObject(Offset offset, Size size)
        : offset(offset), size(size), focusable(Focusable::Unfocusable) {}

    /**
     * @brief offset to parent object
     *
     */
    Offset offset;

    /**
     * @brief this size
     *
     */
    Size size;

    /**
     * @brief if is focusable,
     * in common Object, is Unfocusable
     * to make a Object focusable,
     *
     */
    Focusable focusable;

    /**
     * @brief entry function to draw the object.
     *
     * in this function:
     * first: some prepare work before drawing
     * second: call onDraw(Offset, GraphicsFunction &)
     * last: finish work after drawing
     *
     * @param offset offset to parent object
     * @param func graphics function interface
     */
    void draw(Offset offset, GraphicsFunction &func) const;
};
} // namespace ExGraphics