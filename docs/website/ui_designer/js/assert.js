export function assert(expression, message = "assert failed") {
    if (!expression) {
        console.error(`assert failed: ${message}`);
        throw new Error(message);
    }
}
