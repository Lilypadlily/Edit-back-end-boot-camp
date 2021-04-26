const data = require("../data/portfolio.json");

async function routes(fastify, options) {
  fastify.get("/portfolio.html", async (request, reply) => {
    const { rows } = await fastify.pg.query("SELECT * FROM profiles;", []);

    reply.view("/public/portfolio.ejs", {
      ...data,
      items: rows.map((row) => {
        return {
          filter: row.fltr,
          imgSrc: row.imgsrc,
          title: row.title,
          summary: row.summary,
          galleryHref: row.galleryhref,
          galleryTitle: row.gallerytitle,
        };
      }),
    });
  });
}

module.exports = routes;