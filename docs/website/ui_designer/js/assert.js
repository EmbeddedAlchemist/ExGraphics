export function assert(expression, message = "assert failed") {
    if (!expression)
        throw new Error(message);
}
