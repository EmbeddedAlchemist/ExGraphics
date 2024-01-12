/**
 * @file ExGraphicsConfig.hpp
 * @author your name (you@domain.com)
 * @brief 该文件用于静态配置ExGraphics的各项参数
 * @version 0.1
 * @date 2024-01-10
 * 
 * @copyright Copyright (c) 2024
 * 
 */

#pragma once

#include "Basic/Public/Color.hpp"
#include "Basic/Public/UTF8Parser.hpp"

namespace ExGraphics {

struct Configs {

    // DEBUG ONLY!!! Will degrade performance.
    // IT WILL NOT ENHANCING SECURICY WHEN YOU USE A NORMAL RELEASE
    // add a assert before executing "Unsafe" memory access;
    static constexpr bool useAssert = false;

    // whether an additional border should be drawn for each object for debugging purposes.
    static constexpr bool showObjectBorder = true;
    // color of border
    static constexpr Color objectBorderColor = Color(255, 255, 0);

    // By changing this value, you can choose a different string parser
    using StringParser = UTF8Parser;
};

} // namespace ExGraphics