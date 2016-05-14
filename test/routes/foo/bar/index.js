const barRoutes = [
  {
    method: 'GET',
    path: '/foobar',
    config: {
      description: 'foobar',
      handler(request, reply) {
        reply('bar');
      },
    },
  },
];

module.exports = barRoutes;
