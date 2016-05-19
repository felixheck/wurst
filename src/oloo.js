/**
 * @function
 * @private
 *
 * @description
 * Check if passed item is an object
 *
 * @param {*} item The item to be checked
 * @returns {boolean} The passed item is an object
 */
function isObject(item) {
  return typeof item === 'object';
}

/**
 * @function
 * @public
 *
 * @description
 * Link multiple source objects to a origin-based objects
 *
 * @param {Object} origin The object to be extended
 * @param {Object} sources The source object to be appended
 * @returns {Object} New instance of a combined object
 */
function oloo(origin, ...sources) {
  if (isObject(origin) && sources.every(isObject)) {
    return Object.assign(Object.create(origin), ...sources);
  } else {
    return null;
  }
}

module.exports = oloo;
