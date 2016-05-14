const path = require('path');
const glob = require('glob');
const pkg = require('../package.json');

/**
 * @function
 * @private
 *
 * @description
 * Prefix the path for each of the passed routes
 *
 * @param {Array.<?Object> | Object} routes The list of routes
 * @param {Array.<?string>} prefixes The prefixes to be appended
 * @returns {Array.<?Object>} The list of routes with prefixed paths
 */
function prefixRoutes(routes, prefixes) {
  if (!Array.isArray(routes)) {
    routes = Array.of(routes);
  }

  prefixes = prefixes.split(path.sep);
  prefixes.pop();

  if (prefixes.length !== 0) {
    routes.forEach(route => {
      route.path = `/${prefixes.join('/')}${route.path}`;
    });
  }

  return routes;
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
  let routes;

  const filePaths = glob.sync('**/*.js', {
    nodir: true,
    cwd: options.dir,
    ignore: options.ignore,
  });

  filePaths.forEach(filePath => {
    routes = require(path.join(options.dir, filePath));
    server.route(prefixRoutes(routes, filePath));
  });

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
