const { BasicMessage } = require("../schema");
const argon2 = require("argon2");

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
        const hashedPassword = await argon2.hash(password);
        const { rows } = await fastify.pg.query(
          ` INSERT INTO user_auth2 (email, hashed_password)
            VALUES 
                ($1, $2)
            RETURNING email;`,
          [email, hashedPassword]
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
          ` SELECT hashed_password FROM user_auth2 WHERE email=$1; `,
          [email]
        );

        if (rows.length === 0) throw Error("Email tidak terdaftar");

        const isMatch = await argon2.verify(rows[0].hashed_password, password);
        if (!isMatch) throw Error("Password salah");

        return { token: fastify.jwt.sign({ email }) };
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes