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
  const wurstle = Wurst.factory(server, options);
  wurstle.load();

  return next();
}

/**
 * @type {Object}
 * @public
 */
pluginLoader.attributes = {
  multiple: true,
  pkg,
};

module.exports = pluginLoader;
