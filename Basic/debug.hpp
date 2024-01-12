/**
 * @file debug.hpp
 * @author your name (you@domain.com)
 * @brief 该文件中实现了Debug相关的功能
 * @version 0.1
 * @date 2024-01-10
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#include "ExGraphicsConfig.hpp"

namespace ExGraphics {

/**
 * @brief 调试断言。
 * 若Config::useAssert值为真
 *      则判断expr值
 *          若真，返回
 *          若假，死循环并触发断点
 * 若不为真
 *      直接返回，编译器会优化掉这个function call
 * @param expr 
 */
inline void debugAssert(bool expr) {
    if (Configs::useAssert) {
        if (!expr)
            while (true)
                asm("BKPT 0x00");
    } else
        return;
}
} // namespace ExGraphics
