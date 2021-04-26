const { BasicId, BasicItem } = require("../schema");

module.exports = {
  routePrefix: "/api/docs",
  openapi: {
    info: {
      title: "REST API for BE Bootcamp",
      description: "REST API for BE Bootcamp 2021",
      version: "0.0.1",
      contact: {
        name: "Braga Tech Support",
        url: "https://braga.co.id/contact",
        email: "jherjati@braga.co.id",
      },
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    tags: [
      {
        name: "Profile",
        description: "Profile items related routes",
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: { BasicId, BasicItem },
    },
  },
  exposeRoute: true,
};