const fooRoute = {
  method: 'GET',
  path: '/foo',
  config: {
    description: 'foo',
    handler (request, reply) {
      reply('foo')
    }
  }
}

module.exports = fooRoute
