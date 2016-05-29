const test = require('tape').test;
const sinon = require('sinon');
const Hapi = require('hapi');
const path = require('path');
const Plugin = require('../src');

/**
 * Utils
 */

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

/**
 * Hooks
 */

const setup = () => {
  infoSpy = sinon.spy(console, 'info');
  server = new Hapi.Server();
  server.connection();
}

const teardown = () => {
  infoSpy.restore();
}

/**
 * States
 */

let server;
let pluginOptions;
let infoSpy;

/**
 * Registration
 */

test('plugin/registration >> contains an summary of registered routes', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo(server).every(route => (
      route && route.path && route.method && route.description
    ));

    t.notOk(err);
    t.ok(filtered);
    t.end();
  });

  teardown();
});

test('plugin/registration >> registers the plugin twice', t => {
  setup();

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

    t.notOk(err);
    t.equal(filtered.length, 4);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foo'));
    t.ok(filtered.some(route => route.path === '/bar'));
    t.ok(filtered.some(route => route.path === '/bar/foobar'));
    t.end();
  });

  teardown();
});

/**
 * Options.routes specification
 */

test('plugin/options.routes >> registers a directory with nested directories', t => {
  setup();
  
  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    t.notOk(err);
    t.equal(filtered.length, 4);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foo/foo'));
    t.ok(filtered.some(route => route.path === '/foo/bar/foobar'));
    t.end()
  });

  teardown();
});

test('plugin/options.routes >> registers just a nested directory', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes/foo/bar'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    t.notOk(err);
    t.equal(filtered.length, 2);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foobar'));
    t.end();
  });

  teardown();
});

test('plugin/options.routes >> registers no routes', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'route'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    t.notOk(err);
    t.equal(filtered.length, 0);
    t.end();
  });

  teardown();
});

/**
 * Options.ignore specification
 */

test('plugin/options.ignore >> ignores a single route file', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: 'foo/bar/*.js',
  };

  register(pluginOptions, err => {
    const filtered = getInfo().filter(route => (
      route.description === 'foobar'
    ));

    t.notOk(err);
    t.equal(filtered.length, 0);
    t.end();
  });

  teardown();
});

test('plugin/options.ignore >> ignores multiple route files', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: [
      'foo/bar/*.js',
      'foo/*.js',
    ],
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    t.notOk(err);
    t.equal(filtered.length, 1);
    t.end();
  });

  teardown();
});

/**
 * Options.log specification
 */

test('outputs the mapping', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    log: true,
  };

  register(pluginOptions, err => {
    t.notOk(err);
    t.equal(infoSpy.callCount, 4);
    t.end();
  });

  teardown();
});

test('does not output the mapping', t => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    t.notOk(err);
    t.equal(infoSpy.callCount, 0);
    t.end();
  });

  teardown();
});
