#include "UTF8Parser.hpp"

std::uint32_t UTF8Parser::nextChar(const char *str, std::size_t *charLen) {
    std::uint32_t result = 0;
    std::size_t loopCounter = getCharLength(str);
    if (charLen)
        *charLen = loopCounter;
    while (loopCounter && *str) {
        result <<= 8;
        result |= *str;
        str++;
        loopCounter--;
    }
    return result;
}

std::size_t UTF8Parser::getCharLength(const char *str) {
    if((*str & 0b10000000) == 0)
        return 1;
    else if ((*str & 0b11100000) == 0b11000000)
        return 2;
    else if ((*str & 0b11110000) == 0b11100000)
        return 3;
    else if ((*str & 0b11111000) == 0b11110000)
        return 4;
    return 0;
}
