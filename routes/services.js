const { BasicId, BasicMessage, BasicItem } = require("../schema");
const QueryStream = require("pg-query-stream");
const JSONStream = require("JSONStream");

async function routes(fastify, options) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Services"],
        response: {
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
      },
    },
    async (req, reply) => {
      try {
        const client = await fastify.pg.connect();
        const query = new QueryStream("SELECT * FROM services;", []);
        const stream = client.query(query);
        const jsonStream = stream.pipe(JSONStream.stringify());
        jsonStream.on("end", client.release);
        reply.send(jsonStream);
      } catch (err) {
        return err;
      }
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Services"],
        response: {
          "2xx": { ...BasicMessage, description: "Successful items addition" },
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
        body: BasicItem,
        security: [
          {
            Bearer: [],
          },
        ],
      },
      preValidation: [fastify.authenticate],
    },
    async (req, reply) => {
      try {
        const { email } = req.user;
        if (email !== process.env.ADMIN_EMAIL)
          throw Error("Anda bukan admin");

        const {
          imgSrc,
          title,
          summary,
          galleryHref,
        } = req.body;

        const returnVal = await fastify.pg.query(
          ` INSERT INTO services ( imgSrc, title, summary, galleryHref)
            VALUES 
                ($1, $2, $3, $4)
            RETURNING id ;`,
          [ imgSrc, title, summary, galleryHref]
        );
        console.log(returnVal);

        return { message: "Sukses " };
      } catch (err) {
        return err;
      }
    }
  );

  fastify.put(
    "/:id",
    {
      schema: {
        tags: ["Services"],
        response: {
          "2xx": { ...BasicMessage, description: "Successful item uodate" },
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
        body: BasicItem,
        params: BasicId,
        security: [
          {
            Bearer: [],
          },
        ],
      },
      preValidation: [fastify.authenticate],
    },
    async (req, reply) => {
      try {
        const { email } = req.user;
        if (email !== process.env.ADMIN_EMAIL)
          throw Error("Anda bukan admin");

        const {
          imgSrc,
          title,
          summary,
          galleryHref,
        } = req.body;

        const returnVal = await fastify.pg.query(
          ` UPDATE services
            SET
                 imgSrc = $1, title = $2, summary = $3, galleryHref = $4
            WHERE id = $5;`,
          [
            imgSrc,
            title,
            summary,
            galleryHref,
            req.params.id,
          ]
        );
        console.log(returnVal);

        return { message: "Sukses guys" };
      } catch (err) {
        return err;
      }
    }
  );

  fastify.get(
    "/:id",
    {
      schema: { tags: ["Services"], params: BasicId },
    },
    async (req, reply) => {
      const {
        rows: returnVal,
      } = await fastify.pg.query(`SELECT * FROM services WHERE id=$1;`, [
        req.params.id,
      ]);
      return returnVal;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Services"],
        response: {
          "2xx": { ...BasicMessage, description: "Successful item deletion" },
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
        security: [
          {
            Bearer: [],
          },
        ],
        params: BasicId,
      },
      preValidation: [fastify.authenticate],
    },
    async (req, reply) => {
      try {
        const { email } = req.user;
        if (email !== process.env.ADMIN_EMAIL)
          throw Error("Anda bukan admin");

        const returnVal = await fastify.pg.query(
          `DELETE FROM services WHERE id=$1;`,
          [req.params.id]
        );
        return { message: `Sukses Terhapus ${returnVal.rowCount} item` };
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes;