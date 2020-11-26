/* eslint-disable no-unused-vars */
async function routes(fastify: any, options: Object) {
  fastify.get('/', (request: Object, reply: Object) => ({ hello: 'world' }));
}

module.exports = routes;
