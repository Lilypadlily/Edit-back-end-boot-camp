const fastify = require("fastify")({ logger: false });
const path = require('path')


fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '/public'),
  prefix: '/', // optional: default '/'
})

fastify.get('/awal', function (req, reply) {
    return reply.sendFile('/portfolio.html') 
  })

  const start = async () => {
    try {
      await fastify.listen(3000)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()