const test = require('tape').test;
const sinon = require('sinon');
const Hapi = require('hapi');
const path = require('path');
const Plugin = require('../src');

/**
 * Utils
 */

const getInfo = server => {
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

const register = (server, options, next) => {
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
  const fixtures = {
    infoSpy: sinon.spy(console, 'info'),
    server: new Hapi.Server(),
  };

  fixtures.server.connection();

  return fixtures;
}

const teardown = fixtures => {
  fixtures.infoSpy.restore();
}


/**
 * Registration
 */

test('plugin/registration >> contains an summary of registered routes', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server).every(route => (
      route && route.path && route.method && route.description
    ));

    t.notOk(err);
    t.ok(filtered);
    t.end();
  });

  teardown(fixtures);
});

test('plugin/registration >> registers the plugin twice', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: 'foo/**/*.js',
  };

  const pluginOptions2 = {
    routes: path.join(__dirname, 'routes/foo'),
  };

  register(fixtures.server, pluginOptions, () => {});

  register(fixtures.server, pluginOptions2, err => {
    const filtered = getInfo(fixtures.server);

    t.notOk(err);
    t.equal(filtered.length, 4);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foo'));
    t.ok(filtered.some(route => route.path === '/bar'));
    t.ok(filtered.some(route => route.path === '/bar/foobar'));
    t.end();
  });

  teardown(fixtures);
});

/**
 * Options.routes specification
 */

test('plugin/options.routes >> registers a directory with nested directories', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server);

    t.notOk(err);
    t.equal(filtered.length, 4);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foo/foo'));
    t.ok(filtered.some(route => route.path === '/foo/bar/foobar'));
    t.end()
  });

  teardown(fixtures);
});

test('plugin/options.routes >> registers just a nested directory', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes/foo/bar'),
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server);

    t.notOk(err);
    t.equal(filtered.length, 2);
    t.ok(filtered.some(route => route.path === '/'));
    t.ok(filtered.some(route => route.path === '/foobar'));
    t.end();
  });

  teardown(fixtures);
});

test('plugin/options.routes >> registers no routes', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'route'),
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server);

    t.notOk(err);
    t.equal(filtered.length, 0);
    t.end();
  });

  teardown(fixtures);
});

/**
 * Options.ignore specification
 */

test('plugin/options.ignore >> ignores a single route file', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: 'foo/bar/*.js',
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server).filter(route => (
      route.description === 'foobar'
    ));

    t.notOk(err);
    t.equal(filtered.length, 0);
    t.end();
  });

  teardown(fixtures);
});

test('plugin/options.ignore >> ignores multiple route files', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    ignore: [
      'foo/bar/*.js',
      'foo/*.js',
    ],
  };

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server);

    t.notOk(err);
    t.equal(filtered.length, 1);
    t.end();
  });

  teardown(fixtures);
});

/**
 * Options.log specification
 */

test('plugin/options.log >> outputs the mapping', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
    log: true,
  };

  register(fixtures.server, pluginOptions, err => {
    t.notOk(err);
    t.equal(fixtures.infoSpy.callCount, 4);
    t.end();
  });

  teardown(fixtures);
});

test('plugin/options.log >> does not output the mapping', t => {
  const fixtures = setup();

  const pluginOptions = {
    routes: path.join(__dirname, 'routes'),
  };

  register(fixtures.server, pluginOptions, err => {
    t.notOk(err);
    t.equal(fixtures.infoSpy.callCount, 0);
    t.end();
  });

  teardown(fixtures);
});
