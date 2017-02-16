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
        routes: Joi.string().default(__dirname),
        ignore: [
          Joi.string(),
          Joi.array().items(Joi.string())
        ],
        log: Joi.boolean().default(false)
      }),
      routeObject: Joi.object({
        path: Joi.string().required(),
        method: Joi.string().required()
      }).unknown(true)
    },

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
    extendRouteList (origin, modified, method) {
      this.routeList.push({
        path: modified,
        method,
        origin
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
      return glob.sync('**/*.js', {
        nodir: true,
        cwd: this.options.routes,
        ignore: this.options.ignore
      })
    },

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
    getPathTree (filePath) {
      const splitPath = filePath.split('/')
      splitPath.pop()

      return splitPath
    },

    /**
     * @function
     * @public
     *
     * @description
     * Autoload and prefix routes
     */
    init () {
      this.validateOptions()
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
     * Log the built list of prefixed routes into console
     */
    logRouteList () {
      console.info(`\n${pkg.name} prefixed the following routes`)

      this.routeList.forEach((route) => {
        console.info(
          '\t', padend(`[${route.method}]`, 8), route.path
        )
      })
    },

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
    prefixRoutes (routes, filePath) {
      let prefixedPath

      if (!Array.isArray(routes)) {
        routes = Array.of(routes)
      }

      const pathTree = this.getPathTree(filePath)

      if (pathTree.length !== 0) {
        routes.forEach((route) => {
          this.validateRouteObject(route)
          prefixedPath = `/${pathTree.join('/')}${route.path}`.replace(/\/$/, '')
          this.extendRouteList(route.path, prefixedPath, route.method)
          route.path = prefixedPath
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
     * @param {string} filePath The file path to be loaded and registered
     */
    registerRoutes (filePath) {
      const modulePath = path.join(this.options.routes, filePath)
      const routes = require(modulePath)
      const prefixedRoutes = this.prefixRoutes(routes, filePath)

      this.server.route(prefixedRoutes)
      delete require.cache[modulePath]
    },

    /**
     * @function
     * @public
     *
     * @description
     * Validate plugin options based on defined schema
     */
    validateOptions () {
      this.options = Joi.attempt(this.options, this.schemata.options, 'Invalid options')
    },

    /**
     * @function
     * @public
     *
     * @description
     * Validate route configuration object based on defined schema
     *
     * @param {Object} routeObject The route object to be validated
     */
    validateRouteObject (routeObject) {
      Joi.assert(routeObject, this.schemata.routeObject, 'Invalid route object')
    }
  }
}

module.exports = factory
