const { BasicMessage } = require("../schema");

async function routes(fastify, options) {
  fastify.post(
    "/signup",
    {
      schema: {
        tags: ["Auth"],
        response: {
          "2xx": {
            type: "object",
            properties: { token: { type: "string" } },
            description: "Successful signup",
          },
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          description: "Successful login",
        },
      },
    },
    async (req, reply) => {
      try {
        const { email, password } = req.body;
        const { rows } = await fastify.pg.query(
          ` INSERT INTO user_auth (email, unhashed_password)
            VALUES 
                ($1, $2)
            RETURNING email;`,
          [email, password]
        );
        
        return { token: fastify.jwt.sign(rows[0]) };
      } catch (err) {
        return err;
      }
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        response: {
          "2xx": {
            type: "object",
            properties: { token: { type: "string" } },
            description: "Successful login",
          },
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          description: "Successful login",
        },
      },
    },
    async (req, reply) => {
      try {
        const { email, password } = req.body;

        const {
          rows,
        } = await fastify.pg.query(
          ` SELECT hashed_password FROM user_auth WHERE email=$1; `,
          [email]
        );

        if (rows.length === 0) throw Error("Email tidak terdaftar");
        if (password !== rows[0].hashed_password) throw Error("Password salah");

        return { token: fastify.jwt.sign({ email }) };
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes