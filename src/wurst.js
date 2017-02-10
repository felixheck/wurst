const plugin = require('./plugin')

/**
 * @namespace
 * @public
 *
 * @description
 * Host all related object factories
 */
const Wurst = {
  create: plugin
}

module.exports = Wurst
