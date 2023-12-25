#pragma once
namespace ExGraphics {

class CallbackFunction {

  private:
    void (*function)();

  public:
    inline constexpr CallbackFunction(void (*function)()) : function(function) {}

    inline void operator()(void) const {
        if (function)
            function();
    };
};

} // namespace ExGraphics