const plugin = require('./plugin');
const oloo = require('./oloo');

/**
 * @namespace
 * @public
 *
 * @description
 * Host all related object factories
 */
const Wurst = {
  plugin,

  init(server, options) {
    return oloo(plugin, {
      server,
      options,
      routeList: [],
    });
  },
};

module.exports = Wurst;
