async function routes (fastify, options) {
    fastify.get('/', async (request, reply) => {
       reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
      })
  }
  
  module.exports = routes