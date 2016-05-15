const expect = require('chai').expect;
const Hapi = require('hapi');
const path = require('path');
const wurst = require('../src');

let testServer;
let routeTable;

function getInfo(server) {
  const routes = [];

  server.table().forEach(connection => {
    connection.table.forEach(endpoint => {
      routes.push({
        path: endpoint.path,
        method: endpoint.method,
        description: endpoint.settings.description,
      });
    });
  });

  return routes;
}

function createServer(options) {
  testServer = new Hapi.Server();

  testServer.connection();

  testServer.register({
    register: wurst,
    options,
  }, err => {
    if (err) {
      throw err;
    }
  });

  routeTable = getInfo(testServer);
}

describe('wurst', () => {
  describe('basic specification', () => {
    before(() => {
      createServer({
        routes: path.join(__dirname, 'routes'),
      });
    });

    it('contains routes', () => {
      const checked = routeTable.every(route => (
        route && route.path && route.method && route.description
      ));

      expect(checked).to.equal(true);
    });

    // root route
    it('does contain the root route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'root'
      ));

      expect(filtered.length).to.equal(1);
    });

    it('does not prefix the root route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'root'
      ));

      expect(filtered[0].path).to.equal('/');
    });

    // foo route
    it('does contain the foo route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foo'
      ));

      expect(filtered.length).to.equal(1);
    });

    it('does prefix the foo route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foo'
      ));

      expect(filtered[0].path).to.equal('/foo/foo');
    });

    // bar routes
    it('does contain the bar route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foobar'
      ));

      expect(filtered.length).to.equal(1);
    });

    it('does prefix the bar route', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foobar'
      ));

      expect(filtered[0].path).to.equal('/foo/bar/foobar');
    });
  });

  describe('single ignore specification', () => {
    before(() => {
      createServer({
        routes: path.join(__dirname, 'routes'),
        ignore: [
          'foo/bar/*.js',
        ],
      });
    });

    it('ignores the bar routes', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foobar'
      ));

      expect(filtered.length).to.equal(0);
    });
  });

  describe('multiple ignore specification', () => {
    before(() => {
      createServer({
        routes: path.join(__dirname, 'routes'),
        ignore: [
          'foo/bar/*.js',
          'foo/*.js',
        ],
      });
    });

    it('ignores the bar routes', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foobar'
      ));

      expect(filtered.length).to.equal(0);
    });

    it('ignores the foo routes', () => {
      const filtered = routeTable.filter(route => (
        route.description === 'foo'
      ));

      expect(filtered.length).to.equal(0);
    });
  });

  describe('misconfiguration', () => {
    it('throws error because missing options.routes', () => {
      const wrapper = () => {
        createServer({
          ignore: [
            'foo/bar/*.js',
            'foo/*.js',
          ],
        });
      };

      expect(wrapper).to.throw(/Invalid options/);
    });

    it('throws error because wrong options.routes', () => {
      const wrapper = () => {
        createServer({
          routes: 42,
          ignore: [
            'foo/bar/*.js',
            'foo/*.js',
          ],
        });
      };

      expect(wrapper).to.throw(/Invalid options/);
    });

    it('throws error because wrong options.ignore | number', () => {
      const wrapper = () => {
        createServer({
          routes: path.join(__dirname, 'routes'),
          ignore: 42,
        });
      };

      expect(wrapper).to.throw(/Invalid options/);
    });

    it('throws error because wrong options.ignore | Array.<number>', () => {
      const wrapper = () => {
        createServer({
          routes: path.join(__dirname, 'routes'),
          ignore: [42, 1337],
        });
      };

      expect(wrapper).to.throw(/Invalid options/);
    });
  });
});
