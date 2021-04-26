module.exports = {
    BasicMessage: { type: "object", properties: { message: { type: "string" } } },
    BasicId: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
    BasicItem: {
      type: "object",
      properties: {
        filter: { type: "string" },
        imgSrc: { type: "string" },
        title: { type: "string" },
        summary: { type: "string" },
        galleryHref: { type: "string" },
        galleryTitle: { type: "string" },
      },
    },
  };