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

test('plugin/registration >> contains an summary of registered routes', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo(server).every(route => (
      route && route.path && route.method && route.description
    ));

    assert.notOk(err);
    assert.ok(filtered);
    assert.end();
  });

  teardown();
});

test('plugin/registration >> registers the plugin twice', assert => {
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

    assert.notOk(err);
    assert.equal(filtered.length, 4);
    assert.ok(filtered.some(route => route.path === '/'));
    assert.ok(filtered.some(route => route.path === '/foo'));
    assert.ok(filtered.some(route => route.path === '/bar'));
    assert.ok(filtered.some(route => route.path === '/bar/foobar'));
    assert.end();
  });

  teardown();
});

/**
 * Options.routes specification
 */

test('plugin/options.routes >> registers a directory with nested directories', assert => {
  setup();
  
  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    assert.notOk(err);
    assert.equal(filtered.length, 4);
    assert.ok(filtered.some(route => route.path === '/'));
    assert.ok(filtered.some(route => route.path === '/foo/foo'));
    assert.ok(filtered.some(route => route.path === '/foo/bar/foobar'));
    assert.end()
  });

  teardown();
});

test('plugin/options.routes >> registers just a nested directory', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes/foo/bar'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    assert.notOk(err);
    assert.equal(filtered.length, 2);
    assert.ok(filtered.some(route => route.path === '/'));
    assert.ok(filtered.some(route => route.path === '/foobar'));
    assert.end();
  });

  teardown();
});

test('plugin/options.routes >> registers no routes', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'route'),
  };

  register(pluginOptions, err => {
    const filtered = getInfo();

    assert.notOk(err);
    assert.equal(filtered.length, 0);
    assert.end();
  });

  teardown();
});

/**
 * Options.ignore specification
 */

test('plugin/options.ignore >> ignores a single route file', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: 'foo/bar/*.js',
  };

  register(pluginOptions, err => {
    const filtered = getInfo().filter(route => (
      route.description === 'foobar'
    ));

    assert.notOk(err);
    assert.equal(filtered.length, 0);
    assert.end();
  });

  teardown();
});

test('plugin/options.ignore >> ignores multiple route files', assert => {
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

    assert.notOk(err);
    assert.equal(filtered.length, 1);
    assert.end();
  });

  teardown();
});

/**
 * Options.log specification
 */

test('outputs the mapping', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    log: true,
  };

  register(pluginOptions, err => {
    assert.notOk(err);
    assert.equal(infoSpy.callCount, 4);
    assert.end();
  });

  teardown();
});

test('does not output the mapping', assert => {
  setup();

  pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(pluginOptions, err => {
    assert.notOk(err);
    assert.equal(infoSpy.callCount, 0);
    assert.end();
  });

  teardown();
});
