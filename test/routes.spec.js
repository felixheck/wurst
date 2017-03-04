const test = require('tape').test
const path = require('path')
const { register, getInfo, setup, teardown } = require('./utils')

/**
 * Options.routes specification
 */

test('plugin/options.routes >> registers a directory with nested directories', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes')
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server)

    t.notOk(err)
    t.equal(filtered.length, 4)
    t.ok(filtered.some(route => route.path === '/'))
    t.ok(filtered.some(route => route.path === '/foo/foo'))
    t.ok(filtered.some(route => route.path === '/foo/bar/foobar'))
    t.end()
  })

  teardown(fixtures)
})

test('plugin/options.routes >> registers just a nested directory', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes/foo/bar')
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server)

    t.notOk(err)
    t.equal(filtered.length, 2)
    t.ok(filtered.some(route => route.path === '/'))
    t.ok(filtered.some(route => route.path === '/foobar'))
    t.end()
  })

  teardown(fixtures)
})

test('plugin/options.routes >> registers no routes', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'route')
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server)

    t.notOk(err)
    t.equal(filtered.length, 0)
    t.end()
  })

  teardown(fixtures)
})
