module.exports = {
    confKey: "env", // optional, default: 'config'
    schema: {
      type: "object",
      required: [
        "PORT",
        "DATABASE_URL",
        "JWT_SECRET",
        "ADMIN_EMAIL",
        "BRAGA_EMAIL",
        "BRAGA_PASS",
      ],
      properties: {
        PORT: {
          type: "string",
        },
        DATABASE_URL: {
          type: "string",
        },
        JWT_SECRET: {
          type: "string",
        },
        ADMIN_EMAIL: {
          type: "string",
        },
        BRAGA_EMAIL: {
          type: "string",
        },
        BRAGA_PASS: {
          type: "string",
        },
      },
    },
    dotenv: true,
  }; 