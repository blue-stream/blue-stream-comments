export const config = {
    db: {
        connectionString: `mongodb://${process.env.DB_SERVERS || 'localhost:27017'}/${process.env.COMMENTS_DB_NAME || 'blue-stream-comments'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
    },
    logger: {
        elasticsearch: process.env.LOGGER_ELASTICSEARCH && {
            hosts: process.env.LOGGER_ELASTICSEARCH.split(','),
        },
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
    },
    server: {
        port: +(process.env.PORT || 5003),
        name: process.env.SERVICE_NAME || 'comment',
    },
    validator: {
        comment: {
            text: {
                maxLength: +(process.env.COMMENT_TEXT_MAX_LENGTH || 1000),
                minLength: +(process.env.COMMENT_TEXT_MIN_LENGTH || 1),
            },
        },
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018',
    },
};
