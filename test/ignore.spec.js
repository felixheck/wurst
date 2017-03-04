const test = require('tape').test
const path = require('path')
const { register, getInfo, setup, teardown } = require('./utils')

/**
 * Options.ignore specification
 */

test('plugin/options.ignore >> ignores a single route file', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes'),
    ignore: 'foo/bar/*.js'
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server).filter(route => (
      route.description === 'foobar'
    ))

    t.notOk(err)
    t.equal(filtered.length, 0)
    t.end()
  })

  teardown(fixtures)
})

test('plugin/options.ignore >> ignores multiple route files', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes'),
    ignore: [
      'foo/bar/*.js',
      'foo/*.js'
    ]
  }

  register(fixtures.server, pluginOptions, err => {
    const filtered = getInfo(fixtures.server)

    t.notOk(err)
    t.equal(filtered.length, 1)
    t.end()
  })

  teardown(fixtures)
})
