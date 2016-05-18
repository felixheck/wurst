const factory = require('./factory');

/**
 * @namespace
 * @public
 *
 * @description
 * Host all related object factories
 */
const Wurst = {
  factory(server, options) {
    return Object.assign({}, factory, {
      server,
      options,
      routeList: [],
    });
  },
};

module.exports = Wurst;
