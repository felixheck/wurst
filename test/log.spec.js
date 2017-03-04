const test = require('tape').test
const path = require('path')
const { register, setup, teardown } = require('./utils')

/**
 * Options.log specification
 */

test('plugin/options.log >> outputs the mapping', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes'),
    log: true
  }

  register(fixtures.server, pluginOptions, err => {
    t.notOk(err)
    t.equal(fixtures.infoSpy.callCount, 4)
    t.end()
  })

  teardown(fixtures)
})

test('plugin/options.log >> does not output the mapping', t => {
  const fixtures = setup()

  const pluginOptions = {
    cwd: path.join(__dirname, 'routes')
  }

  register(fixtures.server, pluginOptions, err => {
    t.notOk(err)
    t.equal(fixtures.infoSpy.callCount, 0)
    t.end()
  })

  teardown(fixtures)
})
