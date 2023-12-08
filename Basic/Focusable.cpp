#include "Focusable.hpp"

namespace ExGraphics {

bool Focusable::focusable(void) {
    return index != Unfocusable;
}
} // namespace Graphics
