const rootRoute = {
  method: 'GET',
  path: '/',
  config: {
    description: 'root',
    handler (request, reply) {
      reply('root')
    }
  }
}

module.exports = rootRoute
