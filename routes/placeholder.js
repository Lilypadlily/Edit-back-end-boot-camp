const { request } = require("undici");
const { BasicId, BasicMessage } = require("../schema");

async function routes(fastify, options) {
  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Placeholder"],
        params: BasicId,
        response: {
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
      },
    },
    async (req, reply) => {
      try {
        const { body } = await request(
          "https://jsonplaceholder.typicode.com/todos/" + req.params.id
        );
        let data = "";
        for await (const chunk of body) {
          data += chunk;
        }
        reply.send(data);
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes