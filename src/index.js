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
 * @private
 * 
 * @classdesc
 * Autoload and prefix routes
 */
class Wurst {
  server;
  options;

  /**
   * @constructor
   * @public
   *
   * @description
   * Construct a new instance
   *
   * @param {Object} server The corresponding server object
   * @param {Object} options The passed plugin options
   */
  constructor(server, options) {
    this.server = server;
    this.options = options;

    this.validateOptions();
    this.getFilePaths().forEach(this::this.registerRoutes);
  }

  /**
   * @function
   * @public
   *
   * @description
   * Validate plugin options based on defined schema
   */
  validateOptions() {
    joi.assert(this.options, internals.schemata.options, 'Invalid options');
  }

  /**
   * @function
   * @public
   *
   * @description
   * Get list of file paths based on passed options
   *
   * @returns {Array.<?string>} List of file paths
   */
  getFilePaths() {
    return glob.sync('**/*.js', {
      nodir: true,
      cwd: this.options.routes,
      ignore: this.options.ignore,
    });
  }

  /**
   * @function
   * @public
   *
   * @description
   * Split file path and drop file name
   *
   * @param {string} filePath The file path to be split
   * @returns {Array.<?string>} List of directories
   */
  getPathTree(filePath) {
    const splitPath = filePath.split(path.sep);
    splitPath.pop();

    return splitPath;
  }

  /**
   * @function
   * @public
   *
   * @description
   * Prefix the path for each of the passed routes
   *
   * @param {Array.<?Object> | Object} routes The list of routes
   * @param {string} filePath The related file path
   * @returns {Array.<?Object>} The list of routes with prefixed paths
   */
  prefixRoutes(routes, filePath) {
    if (!Array.isArray(routes)) {
      routes = Array.of(routes);
    }

    const pathTree = this.getPathTree(filePath);

    if (pathTree.length !== 0) {
      routes.forEach(route => {
        route.path = `/${pathTree.join('/')}${route.path}`;
      });
    }

    return routes;
  }

  /**
   * @function
   * @public
   *
   * @description
   * Load and register routes
   *
   * @param {string} filePath The file path to be loaded and registered
   */
  registerRoutes(filePath) {
    const modulePath = path.join(this.options.routes, filePath);
    const routes = require(modulePath);
    const prefixedRoutes = this.prefixRoutes(routes, filePath);

    this.server.route(prefixedRoutes);
    delete require.cache[modulePath];
  }
}

/**
 * @function
 * @public
 *
 * @param {Object} options The plugin options
 * @param {Function} next The callback to return control
 * @returns {*}
 */
function routeLoader(server, options, next) {
  new Wurst(server, options);

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
