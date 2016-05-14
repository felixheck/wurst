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
 * @param {Array.<?string>} segments The segments of the related file path
 * @returns {Array.<?Object>} The list of routes with prefixed paths
 */
function prefixRoutes(routes, segments) {
  if (!Array.isArray(routes)) {
    routes = Array.of(routes);
  }

  segments = segments.split(path.sep);
  segments.pop();

  if (segments.length !== 0) {
    routes.forEach(route => {
      route.path = `/${segments.join('/')}${route.path}`;
    });
  }

  return routes;
}

/**
 * @function
 * @private
 *
 * @description
 * Get list of file paths based on passed options
 *
 * @param {Object} options The options to pick out the unwanted route files
 * @returns {Array.<?string>} List of file paths
 */
function getFilePaths(options) {
  return glob.sync('**/*.js', {
    nodir: true,
    cwd: options.routes,
    ignore: options.ignore,
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
  const filePaths = getFilePaths(options);
  let routes;

  filePaths.forEach(filePath => {
    routes = require(path.join(options.routes, filePath));
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
