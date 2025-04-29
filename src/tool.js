// @ts-check

/**
 * @param {...any} args
 * @returns {never}
 */
const never = (...args) => {
  throw new Error(...args);
};

module.exports = { never };
