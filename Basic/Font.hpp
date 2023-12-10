#pragma once

#include "Bitmap.hpp"
#include "Offset.hpp"

namespace ExGraphics {
class FontCharacter : public MonoBitmap {
  public:
    std::uint32_t charater;
    std::int16_t offsetY;
    constexpr FontCharacter(std::uint32_t charater, const Resource &res, Size size, std::uint8_t grayScaleBits, std::int16_t offsetY)
        : MonoBitmap(res, size, grayScaleBits), offsetY(offsetY), charater(charater){};
};

class Font {
  protected:
    const FontCharacter *characters;
    const std::size_t charactersCount;

  public:
    constexpr Font(const FontCharacter *characters, std::size_t countOfCharacters)
        : characters(characters), charactersCount(countOfCharacters){};
    const FontCharacter *find(std::uint32_t character) const;
};
} // namespace ExGraphics