const path = require('path');
const fs = require('fs');
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

  if (prefixes.length !== 0) {
    routes.forEach(route => {
      route.path = `/${prefixes.join('/')}${route.path}`;
    });
  }

  return routes;
}

/**
 * @function
 * @private
 *
 * @description
 * Load and register files recursively
 *
 * @param {Object} server The current server object
 * @param {string} dir The path to the directory to look up
 * @param {Array.<?string>} prefixes The directory names to be appended
 */
function fileLoader(server, dir, prefixes = []) {
  let itemPath;
  let stats;
  let routes;

  fs.readdirSync(dir).forEach(item => {
    itemPath = path.join(dir, item);
    stats = fs.lstatSync(itemPath);

    if (stats.isFile()) {
      routes = require(itemPath);
      server.route(prefixRoutes(routes, prefixes));
    } else if (stats.isDirectory()) {
      fileLoader(server, itemPath, [...prefixes, item]);
    }
  });
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
  fileLoader(server, options.dir);

  return next();
}

/**
 * @type {Object}
 * @public
 */
routeLoader.attributes = {
  pkg,
};

module.exports = routeLoader;
