const sinon = require('sinon')
const hapi = require('@hapi/hapi')
const plugin = require('../index')

function getInfo (server) {
  return server.table().reduce((result, { path, method, settings }) => {
    result.push({ path, method, description: settings.description })
    return result
  }, [])
}

async function register (server, options, next) {
  await server.register({ plugin, options })
}

function setup () {
  return {
    infoSpy: sinon.spy(console, 'info'),
    server: hapi.server()
  }
}

function teardown (fixtures) {
  fixtures.infoSpy.restore()
}

module.exports = {
  getInfo,
  register,
  setup,
  teardown
}
