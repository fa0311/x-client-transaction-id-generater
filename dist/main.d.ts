/**
 * @param {{[key: string]: string}} cookies
 * @returns {Promise<{get: (method: string, path: string) => Promise<string>}>}
 */
export function createSession(cookies: {
    [key: string]: string;
}): Promise<{
    get: (method: string, path: string) => Promise<string>;
}>;
import { generateTransactionId } from "./encode";
import { decodeTransactionId } from "./decode";
export { generateTransactionId, decodeTransactionId };
