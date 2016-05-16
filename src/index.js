const pkg = require('../package.json');
const Wurst = require('./wurst');

/**
 * @function
 * @public
 *
 * @param {Object} options The plugin options
 * @param {Function} next The callback to return control
 * @returns {*}
 */
function pluginLoader(server, options, next) {
  new Wurst(server, options);

  return next();
}

/**
 * @type {Object}
 * @public
 */
pluginLoader.attributes = {
  multiple: false,
  pkg,
};

module.exports = pluginLoader;
