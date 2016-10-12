/*!
 * @author Felix Heck <hi@whoTheHeck.de>
 * @version 0.9.1
 * @copyright Felix Heck 2016
 * @license MIT
 */

const pkg = require('../package.json');
const Wurst = require('./wurst');
require('babel-polyfill');

/**
 * @function
 * @public
 *
 * @param {Object} server The current server object
 * @param {Object} options The plugin options
 * @param {Function} next The callback to return control
 * @returns {*}
 */
function pluginLoader(server, options, next) {
  Wurst.create(server, options).init();

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
