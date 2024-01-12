#pragma once

#include "Basic/Interface/GraphicsFunction.hpp"
#include "Basic/Public/Offset.hpp"
#include "Basic/Public/Size.hpp"

namespace ExGraphics {

class GraphicsFunction;


/**
 * @brief 这是所有图形对象的基类
 * 在该类中几乎不实现任何功能，只是为所有对象提供统一的接口调用
 * 
 */
class GraphicsObject {
  public:
    /**
     * @brief struct that marked object properties
     *
     */
    struct ObjectFlags {
        /**
         * @brief indicate if the object can get the focus
         *
         * to use this flag, override getFocusCallback(void) and return your own onFocusCallback;
         * when object get focus, onFocusCallback will be call;
         *
         */
        bool focusable : 1;

        /**
         * @brief indicate if the object enabled;
         *
         * to use this flag, override getActivatedCallback(void) and return your own onActivatedCallback;
         * when object get focus and enable = 1, if user try activate object, onActivatedCallback will be call
         *
         *
         *
         */
        bool enabled : 1;

        /**
         * @brief indicate if the object is container;
         *
         * to use this flag, override getContainerProperties(void) and return a pointer to ContainerProperties, which includes the Object that contained;
         *
         */
        bool isContainer : 1;

        constexpr ObjectFlags(
            bool focusable = false,
            bool enabled = false,
            bool isContainer = false)
            : focusable(focusable),
              enabled(enabled),
              isContainer(isContainer) {}
    };

  protected:
    /**
     * @brief middle function to draw this object.
     * DO NOT CALL THIS FUNCTION DIRECTLY, to draw the object, call draw(Offset, GraphicsFunction&) indead;
     * subClass should implement this function.
     * in this function, you should use methon that &func provides to draw self.
     *
     * ** object zero point IS offset, NOT offset + this.offset **
     *
     * @param offset zero point of this object.
     * @param func graphics function interface
     */
    virtual void onDraw(Offset offset, GraphicsFunction &func) const = 0;

  public:

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

    /**
     * @brief should return this object's flag
     * 
     * subclass must implement this interface
     *
     */
    virtual ObjectFlags getFlags(void) const = 0;

    /**
     * @brief the focus index of object in its container. 0 is first;
     * Effective when focusable = true;
     * 
     * subclass must implement this interface
     *
     */
    virtual std::uint16_t getFocusIndex(void) const = 0;

    /**
     * @brief return the offset to parent object
     *
     * subclass must implement this interface
     */
    virtual Offset getOffset(void) const = 0;

    /**
     * @brief return self's size
     * subclass must implement this interface
     *
     */
    virtual Size getSize(void) const = 0;


    /**
     * @brief Get the Focused Callback
     *
     * implement when focusable = true.
     * sub class should implement this interface to return self's onFocusedCallback
     *
     * @return CallbackFunction onFocusCallback, nullptr is no callback
     */
    virtual void onFocused();

    /**
     * @brief Get the Activated Callback
     *
     * implement when foucusable = true and enable = true
     *
     * @return CallbackFunction onActivatedCallback nullptr is no callback
     */
    virtual void onActivated();

    /**
     * @brief Container interface, Get the Inner Element Count
     *
     * Implement when isContainer = true
     *
     * @return std::size_t count of inner elements
     */
    virtual std::size_t getInnerElementCount();

    /**
     * @brief Container interface, Get the Inner Element At index
     *
     * Implement when isContainer = true
     *
     * @param index index of target element
     * @return GraphicsObject* element at index, nullptr for error index.
     */
    virtual GraphicsObject *getInnerElementAt(std::size_t index);

    /**
     * @brief Container interface, Container Parent Object;
     * THIS IS CONTAINER INTERFACE, OTHER OBJECT ARE NOT NECESSARY TO IMPLEMENTATION
     *
     * @return GraphicsObject*
     */
    virtual GraphicsObject *getParentObject();
};

} // namespace ExGraphics
