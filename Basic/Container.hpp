#pragma once

#include "GraphicsObject.hpp"

namespace ExGraphics {

class Container : public GraphicsObject {
  protected:
    /**
     * @brief pointer to elements arary
     * 
     */
    const GraphicsObject *elements;

    /**
     * @brief number of elements
     * 
     */
    std::size_t elementNum;

    /**
     * @brief onDraw funtion inherits from GraphicsObject
     * 
     * @param offset 
     * @param func 
     */
    virtual void onDraw(Offset offset, GraphicsFunction &func);

  public:
    constexpr Container(Offset offset, Size size, const GraphicsObject *elements, std::size_t elementNum)
        : GraphicsObject(offset, size),
          elements(elements), elementNum(elementNum) {}
};

} // namespace ExGraphics
