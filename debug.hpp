
#include "ExGraphicsConfig.hpp"

namespace ExGraphics {

inline void debugAssert(bool expr) {
    if (Configs::useAssert) {
        if (!expr)
            while (true)
                asm("BKPT 0x00");
    } else
        return;
}
} // namespace ExGraphics
