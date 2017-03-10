const path = require('path')
const glob = require('glob')
const Joi = require('joi')
const padend = require('lodash.padend')
const pkg = require('../package.json')

/**
 * @type {Object}
 * @public
 *
 * @memberOf Wurst
 *
 * @description
 * Autoload and prefix routes
 */
function factory (server, options) {
  return {
    server,
    options,
    routeList: [],

    /**
     * @type {Object}
     * @static
     *
     * @description
     * Store joi schemata
     */
    schemata: {
      options: Joi.object({
        routes: Joi.string().default('**/*.js'),
        ignore: [
          Joi.string(),
          Joi.array().items(Joi.string())
        ],
        cwd: Joi.string().default(process.cwd()),
        log: Joi.boolean().default(false)
      })
    },

    /**
     * @function
     * @public
     *
     * @description
     * Autoload and prefix routes
     */
    init () {
      this.options = Joi.attempt(this.options, this.schemata.options, 'Invalid options')
      this.getFilePaths().forEach(this.registerRoutes.bind(this))

      if (this.options.log) {
        this.logRouteList()
      }
    },

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
    extendRouteList ({ path, method }) {
      this.routeList.push({ path, method })
    },

    /**
     * @function
     * @public
     *
     * @description
     * Log the built list of prefixed routes into console
     */
    logRouteList () {
      console.info(`\n${pkg.name} prefixed the following routes`)

      this.routeList.forEach((route) => {
        console.info('\t', padend(`[${route.method}]`, 8), route.path)
      })
    },

    /**
     * @function
     * @public
     *
     * @description
     * Get list of file paths based on passed options
     *
     * @returns {Array.<?string>} List of file paths
     */
    getFilePaths () {
      return glob.sync(this.options.routes, {
        nodir: true,
        cwd: this.options.cwd,
        ignore: this.options.ignore
      })
    },

    /**
     * @function
     * @public
     *
     * @description
     * Load file and clear cache
     *
     * @param {string} absPath The absolute file path to be loaded and registered
     */
    loadRoutesOnce (absPath) {
      let routes = require(absPath)

      if (!Array.isArray(routes)) {
        routes = Array.of(routes)
      }

      delete require.cache[absPath]
      return routes
    },

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
    prefixRoutes (absPath, relPath) {
      const routes = this.loadRoutesOnce(absPath)
      const pathTree = relPath.split('/').slice(0, -1)

      if (pathTree.length !== 0) {
        routes.forEach((route) => {
          route.path = `/${pathTree.join('/')}${route.path}`.replace(/\/$/, '')
          this.extendRouteList(route)
        })
      }

      return routes
    },

    /**
     * @function
     * @public
     *
     * @description
     * Load and register routes
     *
     * @param {string} relPath The releative file path to be loaded and registered
     */
    registerRoutes (relPath) {
      const absPath = path.join(this.options.cwd, relPath)
      const prefixedRoutes = this.prefixRoutes(absPath, relPath)

      this.server.route(prefixedRoutes)
    }
  }
}

module.exports = factory
