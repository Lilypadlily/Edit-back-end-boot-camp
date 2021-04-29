const { BasicId, BasicMessage, BasicItem } = require("../schema");
const QueryStream = require("pg-query-stream");
const JSONStream = require("JSONStream");
async function routes(fastify, options) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Profile"],
        response: {
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
      },
    },
    async (req, reply) => {
      try {
        const client = await fastify.pg.connect();
        const query = new QueryStream("SELECT * FROM profiles;", []);
        const stream = client.query(query);
        const jsonStream = stream.pipe(JSONStream.stringify());
        jsonStream.on("end", client.release);
        reply.send(jsonStream);
        const { rows: returnVal } = await fastify.pg.query(
          `SELECT * FROM profiles;`,
          []
        );
        return returnVal;
      } catch (err) {
        return err;
      }
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Profile"],
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
        if (email !== "admin@admin.com") throw Error("wey, anda bukan admin");

        const {
          filter,
          imgSrc,
          title,
          summary,
          galleryHref,
          galleryTitle,
        } = req.body;

        const returnVal = await fastify.pg.query(
          ` INSERT INTO profiles (fltr, imgSrc, title, summary, galleryHref, galleryTitle)
            VALUES 
                ($1, $2, $3, $4, $5, $6)
            RETURNING id ;`,
          [filter, imgSrc, title, summary, galleryHref, galleryTitle]
        );
        console.log(returnVal);

        return { message: "Sukses guys" };
      } catch (err) {
        return err;
      }
    }
  );

  fastify.put(
    "/:id",
    {
      schema: {
        tags: ["Profile"],
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
        if (email !== "admin@admin.com") throw Error("wey, anda bukan admin");

        const {
          filter,
          imgSrc,
          title,
          summary,
          galleryHref,
          galleryTitle,
        } = req.body;

        const returnVal = await fastify.pg.query(
          ` UPDATE profiles
            SET
                fltr = $1, imgSrc = $2, title = $3, summary = $4, galleryHref = $5, galleryTitle = $6
            WHERE id = $7;`,
          [
            filter,
            imgSrc,
            title,
            summary,
            galleryHref,
            galleryTitle,
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
      schema: { tags: ["Profile"], params: BasicId },
    },
    async (req, reply) => {
      const {
        rows: returnVal,
      } = await fastify.pg.query(`SELECT * FROM profiles WHERE id=$1;`, [
        req.params.id,
      ]);
      return returnVal;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Profile"],
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
        if (email !== "admin@admin.com") throw Error("You are not admin");

        const returnVal = await fastify.pg.query(
          `DELETE FROM profiles WHERE id=$1;`,
          [req.params.id]
        );
        return { message: `Deleting success ${returnVal.rowCount} item` };
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes