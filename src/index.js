const path = require('path');
const glob = require('glob');
const joi = require('joi');
const pkg = require('../package.json');

/**
 * @type {Object}
 * @private
 *
 * @description
 * Host all internal variables
 */
const internals = {};

internals.schemata = {
  options: joi.object({
    routes: joi.string().required(),
    ignore: [
      joi.string(),
      joi.array().items(joi.string()),
    ],
  }),
};

/**
 * @function
 * @private
 *
 * @description
 * Validate plugin options based on defined schema
 */
function validateOptions() {
  const { options, schemata } = internals;

  joi.assert(options, schemata.options, 'Invalid options');
}

/**
 * @function
 * @private
 *
 * @description
 * Get list of file paths based on passed options
 *
 * @returns {Array.<?string>} List of file paths
 */
function getFilePaths() {
  const { options } = internals;

  return glob.sync('**/*.js', {
    nodir: true,
    cwd: options.routes,
    ignore: options.ignore,
  });
}

/**
 * @function
 * @private
 *
 * @description
 * Split file path and drop file name
 *
 * @param {string} filePath The file path to be split
 * @returns {Array.<?string>} List of directories
 */
function getPathTree(filePath) {
  const splitPath = filePath.split(path.sep);
  splitPath.pop();

  return splitPath;
}

/**
 * @function
 * @private
 *
 * @description
 * Prefix the path for each of the passed routes
 *
 * @param {Array.<?Object> | Object} routes The list of routes
 * @param {string} filePath The related file path
 * @returns {Array.<?Object>} The list of routes with prefixed paths
 */
function prefixRoutes(routes, filePath) {
  if (!Array.isArray(routes)) {
    routes = Array.of(routes);
  }

  const pathTree = getPathTree(filePath);

  if (pathTree.length !== 0) {
    routes.forEach(route => {
      route.path = `/${pathTree.join('/')}${route.path}`;
    });
  }

  return routes;
}

/**
 * @function
 * @private
 *
 * @description
 * Load and register routes
 *
 * @param {string} filePath The file path to be loaded and registered
 */
function registerRoutes(filePath) {
  const { options, server } = internals;
  const routes = require(path.join(options.routes, filePath));
  const prefixedRoutes = prefixRoutes(routes, filePath);

  server.route(prefixedRoutes);
}

/**
 * @function
 * @public
 *
 * @param {Object} server The current server object
 * @param {Object} options The plugin options
 * @param {Function} next The callback to return control
 * @returns {*}
 */
function routeLoader(server, options, next) {
  internals.server = server;
  internals.options = options;

  validateOptions();
  getFilePaths().forEach(registerRoutes);

  return next();
}

/**
 * @type {Object}
 * @public
 */
routeLoader.attributes = {
  multiple: false,
  pkg,
};

module.exports = routeLoader;
