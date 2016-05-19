const factory = require('./factory');
const oloo = require('./oloo');

/**
 * @namespace
 * @public
 *
 * @description
 * Host all related object factories
 */
const Wurst = {
  init(server, options) {
    return oloo(factory, {
      server,
      options,
      routeList: [],
    });
  },
};

module.exports = Wurst;
