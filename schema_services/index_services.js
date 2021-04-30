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
        imgSrc: { type: "string" },
        title: { type: "string" },
        summary: { type: "string" },
        galleryHref: { type: "string" },
      },
    },
  };