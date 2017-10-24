const test = require('ava')
const path = require('path')
const helpers = require('./_helpers')

test.beforeEach((t) => {
  t.context.fxt = helpers.setup()
})

test.afterEach.always((t) => {
  helpers.teardown(t.context.fxt)
})

test('server route table contain all necessary properties', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures')
  }

  await helpers.register(t.context.fxt.server, pluginOptions)

  const result = helpers.getInfo(t.context.fxt.server).every((route) => (
    route && route.path && route.method && route.description
  ))

  t.truthy(result)
})

test('register a directory with nested directories', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures')
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  const result = helpers.getInfo(t.context.fxt.server)

  t.is(result.length, 4)
  t.truthy(result.some(route => route.path === '/'))
  t.truthy(result.some(route => route.path === '/foo/foo'))
  t.truthy(result.some(route => route.path === '/foo/bar/foobar'))
})

test('register just a single nested directory', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixtures/foo/bar')
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  const result = helpers.getInfo(t.context.fxt.server)

  t.is(result.length, 2)
  t.truthy(result.some(route => route.path === '/'))
  t.truthy(result.some(route => route.path === '/foobar'))
})

test('register no routes', async (t) => {
  const pluginOptions = {
    cwd: path.join(__dirname, 'fixture')
  }

  await helpers.register(t.context.fxt.server, pluginOptions)
  const result = helpers.getInfo(t.context.fxt.server)

  t.is(result.length, 0)
})

