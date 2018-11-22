export const config = {
    db: {
        host: process.env.DB_SERVER || 'localhost',
        name: process.env.DB_NAME || 'blue-stream-comments',
        port: +(process.env.DB_PORT || 27017),
    },
    logger: {
        durable: false,
        exchangeType: process.env.RMQ_LOGGER_TYPE || 'topic',
        exchange: process.env.RMQ_LOGGER_EXCHANGE || 'blue_stream_logs',
        host: process.env.RMQ_LOGGER_HOST || 'localhost',
        port: +(process.env.RMQ_LOGGER_PORT || 15672),
        username: process.env.RMQ_LOGGER_USER || 'guest',
        password: process.env.RMQ_LOGGER_PASS || 'guest',
        persistent: false,
    },
    server: {
        port: +(process.env.PORT || 5003),
        name: process.env.SERVICE_NAME || 'comment',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    authentication: {
        required: false,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018',
    },
};
