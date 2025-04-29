// @ts-check

/**
 * @param {number[]} timeBytes
 * @returns {Date}
 */
const decodeTimeFromBytes = (timeBytes) => {
  const timeValue = timeBytes.reverse().reduce((acc, value) => (acc << 8) | value, 0);
  const baseTime = 1682924400;
  const actualTime = timeValue + baseTime;
  const date = new Date(actualTime * 1000);
  return date;
};

/**
 * @param {string} transactionId
 * @returns {{keyBytes: number[], time: Date, hashBytes: number[], additional: number}}
 */
const decodeTransactionId = (transactionId) => {
  const base = transactionId + "=".repeat((4 - (transactionId.length % 4)) % 4);
  const decode = Buffer.from(base, "base64");
  const rand = decode[0];
  const value = Array.from(decode.subarray(1)).reverse();

  const data = value.map((byte, i) => byte ^ rand).reverse();

  const keyBytes = data.slice(0, 48);
  const timeNowBytes = data.slice(48, 52);
  const hashBytes = data.slice(52, 68);
  const additional = data[68];

  return {
    keyBytes,
    time: decodeTimeFromBytes(timeNowBytes),
    hashBytes,
    additional,
  };
};

module.exports = { decodeTransactionId };
