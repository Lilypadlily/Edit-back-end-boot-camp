const { BasicMessage } = require("../schema");
const nodemailer = require("nodemailer");

async function routes(fastify, options) {
  let transporter = nodemailer.createTransport({
    host: "srv80.niagahoster.com",
    port: 465,
    secure: true,
    auth: {
      user: fastify.env.BRAGA_EMAIL,
      pass: fastify.env.BRAGA_PASS,
    },
  });

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Mailer"],
        body: {
          type: "object",
          properties: {
            name: { type: "object", properties: { value: { type: "string" } } },
            email: {
              type: "object",
              properties: { value: { type: "string" } },
            },
            subject: {
              type: "object",
              properties: { value: { type: "string" } },
            },
            message: {
              type: "object",
              properties: { value: { type: "string" } },
            },
          },
        },
        response: {
          "5xx": { ...BasicMessage, description: "Failed response" },
        },
      },
    },
    async (req, reply) => {
      try {
        const {
          name: { value: nameValue },
          email,
          subject,
          message,
        } = req.body;

        let info = await transporter.sendMail({
          from: `Braga Email Service <${fastify.env.BRAGA_EMAIL}>`,
          to: "jherjati@gmail.com",
          subject: subject.value,
          text: `You got a message from ${nameValue} (${email.value}). The message is : ${message.value}`,
        });

        reply.send(`Message sent: ${info.messageId}`);
      } catch (err) {
        return err;
      }
    }
  );
}

module.exports = routes