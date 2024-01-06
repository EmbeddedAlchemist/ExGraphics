export function assert(expression: boolean, message: string = "assert failed") {
    if (!expression) {
        console.error(`assert failed: ${message}`);
        throw new Error(message);
    }
}