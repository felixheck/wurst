const expect = require('chai').expect;
const Hapi = require('hapi');
const path = require('path');
const wurst = require('../src');

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

const server = new Hapi.Server();
server.connection({
  port: 8888,
  host: 'localhost',
});
server.register({
  register: wurst,
  options: {
    dir: path.join(__dirname, 'routes'),
  },
}, err => {
  if (err) {
    throw err;
  }
});

const routeTable = getInfo(server);

describe('wurst', () => {
  it('contains routes', () => {
    const checked = routeTable.every(route => (
      route && route.path && route.method && route.description
    ));

    expect(checked).to.be.true;
  });

  describe('root route', () => {
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
  });

  describe('foo route', () => {
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
  });

  describe('bar routes', () => {
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
});
