
namespace ExGraphics {

#ifndef NDEBUG

inline void debugAssert(bool expr) {
    if(!expr) while(true)
        asm("BKPT 0x00");
}

#else 

inline void debugAssert(bool expr){
    return;
}

#endif

} // namespace ExGraphics