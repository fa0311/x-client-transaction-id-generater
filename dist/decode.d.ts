/**
 * @param {string} transactionId
 * @returns {{keyBytes: number[], time: Date, hashBytes: number[], additional: number}}
 */
export function decodeTransactionId(transactionId: string): {
    keyBytes: number[];
    time: Date;
    hashBytes: number[];
    additional: number;
};
