//initialization fastify and server
const fastify = require("fastify")({ logger: true })
const argon2 = require('argon2')
const pg = require('pg')
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
//register plugin
if (process.env.NODE_ENV !== "production")
  require("dotenv").config(require("./config/env").options.dotenv)
  
  fastify.register(require("fastify-env"), {
    ...require("./config/env").options,
    dotenv: false,
  })
const helmet = require('fastify-helmet')
fastify.register(require("fastify-postgres"), require("./config/postgres"))
fastify.register(require("fastify-static"), require("./config/static").public)
fastify.register(require("point-of-view"), require("./config/view"))
fastify.register(require("fastify-jwt"), require("./config/jwt"))
fastify.register(require("fastify-swagger"), require("./config/swagger"))
//jwt authentication login
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
})
//declare routes
fastify.register(require("./routes/static"))
fastify.register(require("./routes/ssr"))
fastify.register(require("./routes/profile"), { prefix: "/api/profiles" })
fastify.register(require("./routes/auth"), { prefix: "/api/auth" })
// just until day 7 boot camp
//fastify.register(require("./routes/api"), { prefix: "/api" }) 
// Run the server!
fastify.ready((err) => {
  if (err) throw err;
  fastify.swagger();
});
const start = async () => {
  try {
    await fastify.listen(process.env.PORT , "0.0.0.0")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()