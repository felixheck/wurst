const test = require('ava')
const path = require('path')
const helpers = require('./_helpers')

test.beforeEach((t) => {
  t.context = helpers.setup()
})

test.afterEach.always((t) => {
  helpers.teardown(t.context)
})

test('output the mapping', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures'),
    log: true
  }

  await helpers.register(t.context.server, pluginOptions)
  t.is(t.context.infoSpy.callCount, 4)
})

test('do not output the mapping', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures')
  }

  await helpers.register(t.context.server, pluginOptions)
  t.is(t.context.infoSpy.callCount, 0)
})
