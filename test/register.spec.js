const test = require('tape').test
const path = require('path')
const { register, getInfo, setup, teardown } = require('./utils')

/**
 * Registration
 */

test('plugin/registration >> contains an summary of registered routes', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes')
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server).every(route => (
      route && route.path && route.method && route.description
    ))

    t.notOk(err)
    t.ok(filtered)
    t.end()
  })

  teardown(fixtures)
})

test('plugin/registration >> registers the plugin twice', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes'),
    ignore: 'foo/**/*.js'
  }

  const pluginOptions2 = {
    cwd: path.join(__dirname, 'routes/foo')
  }

  register(fixtures.server, pluginOptions, () => {})

  register(fixtures.server, pluginOptions2, err => {
    const filtered = getInfo(fixtures.server)

    t.notOk(err)
    t.equal(filtered.length, 4)
    t.ok(filtered.some(route => route.path === '/'))
    t.ok(filtered.some(route => route.path === '/foo'))
    t.ok(filtered.some(route => route.path === '/bar'))
    t.ok(filtered.some(route => route.path === '/bar/foobar'))
    t.end()
  })

  teardown(fixtures)
})
