/**
 * @file Bitmap.hpp
 * @author your name (you@domain.com)
 * @brief 该文件中实现了位图相关的数据结构和方法
 * @version 0.1
 * @date 2024-01-10
 *
 * @copyright Copyright (c) 2024
 *
 */

#pragma once

#include "Offset.hpp"
#include "Resource/Resource.hpp"
#include "Size.hpp"

namespace ExGraphics {

class MonoBitmap;

/**
 * @brief 激活的单色位图
 * 该类由MonoBitmap的Activate方法返回
 * 该类中提供方法可以自由地读取位图中地像素
 * 使用该类时建议在栈上生成对象，在生成时会自动从Resource中获取bitmap，生命周期结束后会自动释放
 */
class ActivatedMonoBitmap {
  protected:
    /**
     * @brief 对原本单色位图的引用
     *
     */
    const MonoBitmap &bitmap;

    /**
     * @brief 指向内存中位图数据的指针
     *
     */
    const std::uint8_t *data;

    /**
     * @brief 该方法返回指定位置的比特值
     *
     * @param bitIndex 希望获取的第几个比特
     * @return std::uint8_t
     */
    std::uint8_t getBit(std::size_t bitIndex);

  public:
    /**
     * @brief 位图尺寸
     *  由于绘制时需要频繁读取，尽管bitmap中存有此数据的副本，但依然在此保存一份，以免频繁解引用的开销
     */
    const Size size;
    /**
     * @brief 位图的灰阶数
     * 和size一样，为了优化性能而制作的副本
     */

    const std::uint8_t grayScaleBits;

    /**
     * @brief 连续读取时的字节下标，指向下一比特所处字节
     * 
     */
    const std::uint8_t *bytePtr;

    /**
     * @brief 连续读取时的mask
     * 
     */
    std::uint8_t byteMask;

    /**
     * @brief random get pixel at offset, no out-of-bounds check.
     *
     * @param offset
     * @return std::uint8_t
     */
    std::uint8_t getPixel(Offset offset);

    /**
     * @brief start for sequential read pixel, no out-of-bounds check. (speed optimization)
     *
     * @param offset
     */
    void seqGetStart(Offset offset);

    /**
     * @brief sequential read pixel, speed optimization. no out-of-bounds check. after read, read pointer will move to next.
     *
     * @return std::uint8_t
     */
    std::uint8_t seqGetPixel(void);

    ActivatedMonoBitmap(const MonoBitmap &bitmap);
    ~ActivatedMonoBitmap();
};

class MonoBitmap {

  protected:
    friend class ActivatedMonoBitmap;
    const Resource &res;
    const std::uint8_t grayScaleBits;

  public:
    const Size size;
    constexpr MonoBitmap(const Resource &res, const Size size, std::uint8_t grayScaleBits) : res(res), size(size), grayScaleBits(grayScaleBits){};
    const ActivatedMonoBitmap activate() const;
};

template <typename ColorType>
class ActivatedColorBitmap {
};

template <typename ColorType>
class ColorBitmap {
  protected:
    const Resource &res;

  public:
    const Size size;
    constexpr ColorBitmap(const Resource &res, const Size size) : res(res), size(size){};
    const ActivatedColorBitmap<ColorType> activate() const;
};

} // namespace ExGraphics