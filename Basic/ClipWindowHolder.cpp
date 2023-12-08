#include "ClipWindowHolder.hpp"

ExGraphics::ClipWindowHolder::ClipWindowHolder(GraphicsFunction &func) {
    func.getClipWindow(const_cast<Offset &>(offset), const_cast<Size &>(size));
}

void ExGraphics::ClipWindowHolder::reset(GraphicsFunction &func) {
    func.setClipWindow(offset, size);
}
