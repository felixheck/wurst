const sinon = require('sinon')
const Hapi = require('hapi')
const Plugin = require('../src/index')

/**
 * Utils
 */

const getInfo = server => {
  const routes = []

  server.table().forEach(connection => {
    connection.table.forEach(endpoint => {
      routes.push({
        path: endpoint.path,
        method: endpoint.method,
        description: endpoint.settings.description
      })
    })
  })

  return routes
}

const register = (server, options, next) => {
  server.register({
    register: Plugin,
    options
  },
    err => next(err)
  )
}

/**
 * Hooks
 */

const setup = () => {
  const fixtures = {
    infoSpy: sinon.spy(console, 'info'),
    server: new Hapi.Server()
  }

  fixtures.server.connection()

  return fixtures
}

const teardown = fixtures => {
  fixtures.infoSpy.restore()
}

module.exports = {
  getInfo,
  register,
  setup,
  teardown
}
