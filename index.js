//initialization fastify and server
const fastify = require("fastify")({ logger: false })
//register plugin
fastify.register(require("fastify-static"), require("./config/static").public)
fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
})
//declare routes
fastify.register(require("./routes/static"))
fastify.register(require("./routes/ssr"))

const start = async () => {
  try {
    await fastify.listen(process.env.PORT, "0.0.0.0")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()