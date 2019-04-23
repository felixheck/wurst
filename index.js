const path = require('path')
const glob = require('glob-promise')
const joi = require('@hapi/joi')
const pkg = require('./package.json')

/**
 * @type {Object}
 *
 * @description
 * Internally used data
 */
const internals = {
  routeList: []
}

/**
 * @type {Object}
 *
 * @description
 * Store joi schemata
 */
const schemata = {
  options: joi.object({
    routes: joi.string().default('**/*.js'),
    ignore: [
      joi.string(),
      joi.array().items(joi.string())
    ],
    cwd: joi.string().default(process.cwd()),
    log: joi.boolean().default(false)
  })
}

/**
 * @function
 * @public
 *
 * @description
 * Initialize auto-loading and prefixing of routes
 */
async function init (server, options) {
  internals.server = server
  internals.options = joi.attempt(options, schemata.options, 'Invalid options')

  const filePaths = await getFilePaths()

  filePaths.forEach(registerRoutes)

  if (internals.options.log) {
    logRouteList()
  }
}

/**
 * @function
 * @public
 *
 * @description
 * Extend the list of prefixed routes
 *
 * @param {string} path The modified route path
 * @param {string} method The concerning HTTP method
 */
function extendRouteList ({ path, method }) {
  internals.routeList.push({ path, method })
}

/**
 * @function
 * @public
 *
 * @description
 * Log the built list of prefixed routes into console
 */
function logRouteList () {
  console.info(`\n${pkg.name} prefixed the following routes`)

  internals.routeList.forEach((route) => {
    console.info('  ', `[${route.method}]`.padEnd(8), route.path)
  })
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
function getFilePaths () {
  return glob(internals.options.routes, {
    nodir: true,
    cwd: internals.options.cwd,
    ignore: internals.options.ignore
  })
}

/**
 * @function
 * @public
 *
 * @description
 * Load file and clear cache
 *
 * @param {string} absPath The absolute file path to be loaded and registered
 */
function loadRoutesOnce (absPath) {
  let routes = require(absPath)

  if (!Array.isArray(routes)) {
    routes = Array.of(routes)
  }

  delete require.cache[absPath]
  return routes
}

/**
 * @function
 * @public
 *
 * @description
 * Prefix the path for each of the passed routes
 *
 * @param {Array.<?Object> | Object} absPath The absolute file path to be loaded and registered
 * @param {string} relPath The releative file path to be loaded and registered
 * @returns {Array.<?Object>} The list of routes with prefixed paths
 */
function prefixRoutes (absPath, relPath) {
  const routes = loadRoutesOnce(absPath)
  const pathTree = relPath.split('/').slice(0, -1)

  if (pathTree.length !== 0) {
    routes.forEach((route) => {
      route.path = `/${pathTree.join('/')}${route.path}`.replace(/\/$/, '')
      extendRouteList(route)
    })
  }

  return routes
}

/**
 * @function
 * @public
 *
 * @description
 * Load and register routes
 *
 * @param {string} relPath The releative file path to be loaded and registered
 */
function registerRoutes (relPath) {
  const absPath = path.join(internals.options.cwd, relPath)
  const prefixedRoutes = prefixRoutes(absPath, relPath)

  internals.server.route(prefixedRoutes)
}

module.exports = {
  register: init,
  pkg
}
