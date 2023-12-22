#pragma once

#include "Offset.hpp"
#include "Resource/Resource.hpp"
#include "Size.hpp"

namespace ExGraphics {

class MonoBitmap;

class ActivatedMonoBitmap {
  protected:
    const MonoBitmap &bitmap;
    const std::uint8_t *data;
    std::uint8_t getBit(std::size_t bitIndex);

  public:
    const Size size;
    const std::uint8_t *bytePtr;
    const std::uint8_t grayScaleBits;
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