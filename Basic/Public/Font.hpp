#pragma once

#include "Bitmap.hpp"
#include "Offset.hpp"

namespace ExGraphics {
class FontCharacter : public MonoBitmap {
  public:
    /**
     * @brief UTF8 code of the character
     * 
     */
    std::uint32_t charater;

    /**
     * @brief Y direction of the character
     * 
     */
    std::int16_t offsetY;
    constexpr FontCharacter(std::uint32_t charater, const Resource &res, Size size, std::uint8_t grayScaleBits, std::int16_t offsetY)
        : MonoBitmap(res, size, grayScaleBits), offsetY(offsetY), charater(charater){};
};

class Font {
  protected:
    /**
     * @brief pointer to font character array;
     *  ** this array must be sorted by character code because of find method is using binary search **
     */
    const FontCharacter *characters;

    /**
     * @brief number of characters, aka elements count of characters array
     * 
     */
    const std::size_t charactersCount;

  public:

    /**
     * @brief height of font ascent
     * 
     */
    const std::uint16_t ascentHeight;

    /**
     * @brief height of font descent
     * hua
     */
    const std::uint16_t descentHeight;

    constexpr Font(
        const FontCharacter *characters,
        std::size_t countOfCharacters,
        std::uint16_t ascentHeight,
        std::uint16_t descentHeight)
        : characters(characters),
          charactersCount(countOfCharacters),
          ascentHeight(ascentHeight),
          descentHeight(descentHeight){};

    /**
     * @brief find FontCharacter with utf8 code in characters array.
     *
     * @param character utf8 code
     * @return const FontCharacter* null if not found;
     */
    const FontCharacter *find(std::uint32_t character) const;
};
} // namespace ExGraphics