const barRoutes = [
  {
    method: 'GET',
    path: '/',
    config: {
      description: 'foobar',
      handler (request, reply) {
        reply('bar')
      }
    }
  },
  {
    method: 'GET',
    path: '/foobar',
    config: {
      description: 'foobar',
      handler (request, reply) {
        reply('bar')
      }
    }
  }
]

module.exports = barRoutes
