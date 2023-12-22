#include "Bitmap.hpp"

#include "Basic/debug.hpp"

namespace ExGraphics {

std::uint8_t ActivatedMonoBitmap::getBit(std::size_t bitIndex) {
    std::size_t byteIndex = bitIndex / (sizeof(std::uint8_t) * 8);
    bitIndex = bitIndex % (sizeof(std::uint8_t) * 8);
    std::uint8_t mask = 0x80 >> bitIndex;
    return (data[byteIndex] & mask) != 0;
}

std::uint8_t ActivatedMonoBitmap::getPixel(Offset offset) {
    std::uint8_t result = 0;
    std::size_t bitIndex = (offset.y * size.width + offset.x) * grayScaleBits;
    std::size_t loopCounter = grayScaleBits;
    debugAssert(offset.x <= size.width || offset.y <= size.height);
    while (loopCounter) {
        result <<= 1;
        result |= getBit(bitIndex);
        bitIndex++;
        loopCounter--;
    }
    return result;
}

void ActivatedMonoBitmap::seqGetStart(Offset offset) {
    std::size_t bitIndex = (offset.y * size.width + offset.x) * grayScaleBits;
    bytePtr = &data[bitIndex / 8];
    byteMask = 0x80 >> (bitIndex % 8);
}

std::uint8_t ActivatedMonoBitmap::seqGetPixel(void) {
    std::size_t loopCounter = grayScaleBits;
    std::uint8_t result = 0;
    while(loopCounter){
        result <<= 1;
        result |= (*bytePtr & byteMask) != 0;
        byteMask >>= 1;
        if(byteMask == 0){
            bytePtr++;
            byteMask = 0x80;
        }
        loopCounter--;
    }
    return result;
}

ActivatedMonoBitmap::ActivatedMonoBitmap(const MonoBitmap &bitmap)
    : bitmap(bitmap), size(bitmap.size), grayScaleBits(bitmap.grayScaleBits) {
    data = reinterpret_cast<const std::uint8_t *>(bitmap.res.request());
}

ActivatedMonoBitmap::~ActivatedMonoBitmap() {
    bitmap.res.release();
}

const ActivatedMonoBitmap MonoBitmap::activate() const {
    return ActivatedMonoBitmap(*this);
}

} // namespace ExGraphics