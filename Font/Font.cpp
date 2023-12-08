#include "Font.hpp"

namespace ExGraphics {

const FontCharacter *Font::find(std::uint32_t target) const {
    std::int32_t start = 0,
                  end = charactersCount - 1,
                  mid;
    const FontCharacter *curr;
    do {
        mid = (start + end) / 2;
        curr = &characters[mid];
        if (target < curr->charater)
            end = mid - 1;
        else if (target > curr->charater)
            start = mid + 1;
        else
            return curr;
    } while (start <= end);
    return nullptr;
}
} // namespace ExGraphics