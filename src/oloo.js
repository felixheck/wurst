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
  return Object.assign(Object.create(origin), ...sources);
}

module.exports = oloo;
