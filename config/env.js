module.exports={
     options : {
        confKey: 'config', // optional, default: 'config'
        schema: {
            type: 'object',
            required: [ 'PORT' ],
            properties: {
            PORT: {
                type: 'string',
            },
        },
    },
    dotenv: {
        path: `${__dirname}/../.env`,
        debug: true,
      }
    }
}
    