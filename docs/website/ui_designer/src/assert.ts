export function assert(expression: boolean, message: string = "assert failed") {
    if (!expression)
        throw new Error(message);
}