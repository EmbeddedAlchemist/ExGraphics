/**
 * @file UIFunction.hpp
 * @author your name (you@domain.com)
 * @brief 该文件提供了UI操作相关的接口
 * @version 0.1
 * @date 2024-01-10
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#pragma once

#include <cstddef>

namespace ExGraphics {

class GraphicsObject;    

class UIFunction {
  private:
    // GraphicsObject rootContainer;
    /**
     * @brief 指向被聚焦的对象
     * 
     */
    GraphicsObject *focusedObject = nullptr;

    /**
     * @brief 指向聚焦对象所处的容器
     * 
     */
    GraphicsObject *currContainer = nullptr;

    /**
     * @brief 标记聚焦对象在容器中的下标
     * 
     */
    std::size_t elementIndex = 0;

  public:
    GraphicsObject *getFocusedObject(void);
    GraphicsObject *getFocusedContainer(void);
    std::size_t getElementIndex(void);

    void setFocus(GraphicsObject &object);
    void activate(GraphicsObject &object);
    void focusNext(void);
    void focusPrev(void);
    void activateFocused(void);
};
} // namespace ExGraphics

#include "Basic/UI/GraphicsObject.hpp"