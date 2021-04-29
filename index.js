const fastify = require("fastify")({ logger: true });
fastify.decorate("env", require("env-schema")(require("./config/env")));
fastify.register(require("fastify-multipart"), { attachFieldsToBody: true });

// Register core plugins
fastify.register(require("fastify-postgres"), require("./config/postgres"));
fastify.register(require("fastify-swagger"), require("./config/swagger"));
fastify.register(require("fastify-static"), require("./config/static"));
fastify.register(require("fastify-helmet"), require("./config/helmet"));
fastify.register(require("point-of-view"), require("./config/view"));
fastify.register(require("fastify-cors"), require("./config/cors"));
fastify.register(require("fastify-jwt"), require("./config/jwt"));

fastify.decorate("authenticate", async function (req, reply) {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Register custom routes (route included)
fastify.register(require("./routes/static"));
fastify.register(require("./routes/ssr"));
fastify.register(require("./routes/profile"), { prefix: "/api/profiles" });
fastify.register(require("./routes/auth"), { prefix: "/api/auth" });
fastify.register(require("./routes/mail"), { prefix: "/api/mail" });
fastify.register(require("./routes/placeholder"), {prefix: "/api/placeholder"});

// Run the server!
fastify.ready((err) => {
  if (err) throw err;
  fastify.swagger();
});

start = async () => {
  try {
    await fastify.listen(fastify.env.PORT, "0.0.0.0");
    console.log("Start on port " + fastify.env.PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();