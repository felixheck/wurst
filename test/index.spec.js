const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Hapi = require('hapi');
const path = require('path');
const Plugin = require('../src');

const expect = chai.expect;
chai.use(sinonChai);

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
  };

  const register = (options, next) => {
    server.register({
      register: Plugin,
      options,
    },
      err => next(err)
    );
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
        ignore: 'foo/**/*.js',
      };

      register(pluginOptions, () => {});

      pluginOptions = {
        routes: path.join(__dirname, 'routes/foo'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(4);
        expect(filtered.some(route => route.path === '/')).to.be.true;
        expect(filtered.some(route => route.path === '/foo')).to.be.true;
        expect(filtered.some(route => route.path === '/bar')).to.be.true;
        expect(filtered.some(route => route.path === '/bar/foobar')).to.be.true;
        return done();
      });
    });
  });

  describe('options.routes specification:', () => {
    it('registers a directory with nested directories', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(4);
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
        expect(filtered.length).to.equal(2);
        expect(filtered.some(route => route.path === '/')).to.be.true;
        expect(filtered.some(route => route.path === '/foobar')).to.be.true;
        return done();
      });
    });

    it('registers no routes', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'route'),
      };

      register(pluginOptions, err => {
        const filtered = getInfo();

        expect(err).to.not.exist;
        expect(filtered.length).to.equal(0);
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

  describe('options.log specification: ', () => {
    let infoSpy;

    beforeEach(() => {
      infoSpy = sinon.spy(console, 'info');
    });

    afterEach(() => {
      infoSpy.restore();
    });

    it('outputs the mapping', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
        log: true,
      };

      register(pluginOptions, err => {
        expect(err).to.not.exist;
        expect(infoSpy).to.have.callCount(4);
        return done();
      });
    });

    it('does not output the mapping', done => {
      pluginOptions = {
        routes: path.join(__dirname, 'routes'),
      };

      register(pluginOptions, err => {
        expect(err).to.not.exist;
        expect(infoSpy).to.have.callCount(0);
        return done();
      });
    });
  });
});
