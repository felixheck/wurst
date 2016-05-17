const path = require('path');
const glob = require('glob');
const Joi = require('joi');
require('babel-polyfill');
/**
 * @public
 *
 * @classdesc
 * Autoload and prefix routes
 */
class Wurst {
  /**
   * @type {Object}
   * @static
   *
   * @description
   * Store joi schemata
   */
  static schemata = {
    options: Joi.object({
      routes: Joi.string().required(),
      ignore: [
        Joi.string(),
        Joi.array().items(Joi.string()),
      ],
      log: Joi.boolean(),
    }),
    routeObject: Joi.object({
      path: Joi.string().required(),
      method: Joi.string().required(),
    }).unknown(true),
  };

  routeList = [];
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
  }

  /**
   * @function
   * @public
   *
   * @description
   * Extend the list of prefixed routes
   *
   * @param {string} origin The former route path
   * @param {string} modified The modified route path
   * @param {string} method The concerning HTTP method
   */
  extendRouteList(origin, modified, method) {
    this.routeList.push({
      path: modified,
      method,
      origin,
    });
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
   * Autoload and prefix routes
   */
  load() {
    this.validateOptions();
    this.getFilePaths().forEach(this::this.registerRoutes);

    this.options.log && this.logRouteList();
  }

  /**
   * @function
   * @public
   *
   * @description
   * Log the built list of prefixed routes into console
   */
  logRouteList() {
    console.info(`\n${this.constructor.name} prefixed the following routes`);

    this.routeList.forEach(route => {
      console.info(
        '\t', `[${route.method}]`.padEnd(8), route.path
      );
    });
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
    let prefixedPath;

    if (!Array.isArray(routes)) {
      routes = Array.of(routes);
    }

    const pathTree = this.getPathTree(filePath);

    if (pathTree.length !== 0) {
      routes.forEach(route => {
        this.validateRouteObject(route);
        prefixedPath = `/${pathTree.join('/')}${route.path}`.replace(/\/$/, '');
        this.extendRouteList(route.path, prefixedPath, route.method);
        route.path = prefixedPath;
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

  /**
   * @function
   * @public
   *
   * @description
   * Validate plugin options based on defined schema
   */
  validateOptions() {
    Joi.assert(this.options, Wurst.schemata.options, 'Invalid options');
  }

  /**
   * @function
   * @public
   *
   * @description
   * Validate route configuration object based on defined schema
   *
   * @param {Object} routeObject The route object to be validated
   */
  validateRouteObject(routeObject) {
    Joi.assert(routeObject, Wurst.schemata.routeObject, 'Invalid route object');
  }
}

module.exports = Wurst;
