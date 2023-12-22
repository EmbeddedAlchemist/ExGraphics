#pragma once

#include <cstdint>
#include <cstddef>

class UTF8Parser{
    private:
      static std::size_t getCharLength(const char *str);

    public:
      static std::uint32_t nextChar(const char *str, std::size_t *charLen);
};