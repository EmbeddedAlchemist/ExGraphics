#include "ClipWindowHolder.hpp"

ExGraphics::ClipWindowHolder::ClipWindowHolder(DrawingFunction &func) {
    func.getClipWindow(const_cast<Offset &>(offset), const_cast<Size &>(size));
}

void ExGraphics::ClipWindowHolder::reset(DrawingFunction &func) {
    func.setClipWindow(offset, size);
}
