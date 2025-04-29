/**
 * @param {string} method
 * @param {string} path
 * @param {string} key
 * @param {string} animationKey
 * @returns {Promise<string>}
 */
export function generateTransactionId(method: string, path: string, key: string, animationKey: string): Promise<string>;
/**
 * @param {Uint8Array} data
 * @returns {string}
 */
export function encodeBase64(data: Uint8Array): string;
/**
 * @param {string} data
 * @returns {number[]}
 */
export function decodeBase64(data: string): number[];
