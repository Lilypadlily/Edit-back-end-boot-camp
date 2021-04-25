//initial fastify
const fastify = require("fastify")({ logger: false })

fastify.register(require("fastify-static"), require("./config/static").public)

fastify.get('/', async (request, reply) => {
  reply.sendFile('index.html') 
})

const start = async () => {
  try {
    await fastify.listen(process.env.PORT, "0.0.0.0")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()