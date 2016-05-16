const expect = require('chai').expect;
const Hapi = require('hapi');
const path = require('path');
const Plugin = require('../src');

describe('plugin', () => {
  let server;
  let pluginOptions;

  const getInfo = () => {
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

  const register = (options, next) => {
    server.register({
      register: Plugin,
      options,
    }, err => {
      return next(err);
    });
  };

  beforeEach(done => {
    server = new Hapi.Server();
    server.connection();
    return done();
  });

  describe('registrations', () => {
    it('contains an summary of registered routes', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo(server).every(route => (
          route && route.path && route.method && route.description
        ));

        expect(err).to.not.exist;
        expect(filtered).to.equal(true);
        return done();
      });
    });

    it('registers the plugin twice', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
        ignore: 'foo/bar/*.js'
      };

      register(pluginOptions, err => {});

      pluginOptions = {
        routes: path.join(__dirname, 'routes/foo/bar')
      }

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(3);
        expect(filtered.some(route => route.path === '/')).to.be.true;
        expect(filtered.some(route => route.path === '/foo/foo')).to.be.true;
        expect(filtered.some(route => route.path === '/foobar')).to.be.true;
        return done();
      });
    })
  });

  describe('options.routes specification:', () => {
    it('registers a directory with nested directories', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(3);
        expect(filtered.some(route => route.path === '/')).to.be.true;
        expect(filtered.some(route => route.path === '/foo/foo')).to.be.true;
        expect(filtered.some(route => route.path === '/foo/bar/foobar')).to.be.true;
        return done();
      });
    });

    it('registers just a nested directory', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes/foo/bar'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(1);
        expect(filtered[0].path).to.equal('/foobar');
        return done();
      });
    });
  });

  describe('options.ignore specification: ', () => {
    it('ignores a single route file', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
        ignore: 'foo/bar/*.js',
      };

      register(pluginOptions, err => {
        const filtered = getInfo().filter(route => (
          route.description === 'foobar'
        ));

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(0);
        return done();
      });
    });

    it('ignores multiple route files', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
        ignore: [
          'foo/bar/*.js',
          'foo/*.js',
        ],
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(1);
        return done();
      });
    });
  });
});
