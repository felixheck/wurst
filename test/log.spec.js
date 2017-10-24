const test = require('ava')
const path = require('path')
const helpers = require('./_helpers')

test.beforeEach((t) => {
  t.context.fxt = helpers.setup()
})

test.afterEach.always((t) => {
  helpers.teardown(t.context.fxt)
})

test('output the mapping', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures'),
    log: true
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  t.is(t.context.fxt.infoSpy.callCount, 4)
})

test('do not output the mapping', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures')
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  t.is(t.context.fxt.infoSpy.callCount, 0)
})
