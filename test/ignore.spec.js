const test = require('ava')
const path = require('path')
const helpers = require('./_helpers')

test.beforeEach((t) => {
  t.context.fxt = helpers.setup()
})

test.afterEach.always((t) => {
  helpers.teardown(t.context.fxt)
})

test('plugin/options.ignore >> ignores a single route file', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures'),
    ignore: 'foo/bar/*.js'
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  const result = helpers.getInfo(t.context.fxt.server).filter(route => (
    route.description === 'foobar'
  ))

  t.is(result.length, 0)
})

test('plugin/options.ignore >> ignores multiple route files', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures'),
    ignore: [
      'foo/bar/*.js',
      'foo/*.js'
    ]
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  const result = helpers.getInfo(t.context.fxt.server)

  t.is(result.length, 1)
})
