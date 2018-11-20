export type Configuration = {
    db: {
        host: string;
        name: string;
        port: number;
    };
    logger: {
        durable: boolean;
        exchangeType: string;
        exchange: string;
        host: string;
        port: number;
        password: string;
        username: string;
        persistent: boolean;
    };
    rabbitMQ: {
        host: string;
        exchanges: {
            commentReceiver: string;
            commentPublisher: string;
        };
        reconnect_timeout: number;
    };
    server: {
        port: number,
        name: string,
    };
    authentication: {
        required: boolean;
        secret: string;
    };
    cors: {
        allowedOrigins: string[],
    },
};

const development: Configuration = {
    db: {
        host: process.env.DB_SERVER || 'localhost',
        name: process.env.DB_NAME || 'blue-stream-comments',
        port: 27017,
    },
    logger: {
        durable: false,
        exchangeType: 'topic' || process.env.RMQ_LOGGER_TYPE,
        exchange: 'blue_stream_logs' || process.env.RMQ_LOGGER_EXCHANGE,
        host: 'localhost' || process.env.RMQ_LOGGER_HOST,
        port: 15672 || process.env.RMQ_LOGGER_PORT,
        password: 'guest' || process.env.RMQ_LOGGER_PASS,
        username: 'guest' || process.env.RMQ_LOGGER_USER,
        persistent: false,
    },
    rabbitMQ: {
        host: 'localhost',
        exchanges: {
            commentReceiver: 'comment',
            commentPublisher: 'comment',
        },
        reconnect_timeout: 1000,
    },
    server: {
        port: 5003,
        name: 'comment',
    },
    authentication: {
        required: false,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
};

const production: Configuration = {
    db: {
        host: process.env.DB_SERVER || 'localhost',
        name: process.env.DB_NAME || 'blue-stream-comments',
        port: 27017,
    },
    logger: {
        durable: false,
        exchangeType: 'topic' || process.env.RMQ_LOGGER_TYPE,
        exchange: 'blue_stream_logs' || process.env.RMQ_LOGGER_EXCHANGE,
        host: 'localhost' || process.env.RMQ_LOGGER_HOST,
        port: 15672 || process.env.RMQ_LOGGER_PORT,
        password: 'guest' || process.env.RMQ_LOGGER_PASS,
        username: 'guest' || process.env.RMQ_LOGGER_USER,
        persistent: false,
    },
    rabbitMQ: {
        host: 'localhost',
        exchanges: {
            commentReceiver: 'comment',
            commentPublisher: 'comment',
        },
        reconnect_timeout: 1000,
    },
    server: {
        port: process.env.PORT ? +process.env.PORT : 5003,
        name: 'comment',
    },
    authentication: {
        required: false,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
};

const test: Configuration = {
    db: {
        host: process.env.DB_SERVER || 'localhost',
        name: process.env.DB_NAME || 'blue-stream-comments-test',
        port: 27017,
    },
    logger: {
        durable: false,
        exchangeType: 'topic' || process.env.RMQ_LOGGER_TYPE,
        exchange: 'blue_stream_logs' || process.env.RMQ_LOGGER_EXCHANGE,
        host: 'localhost' || process.env.RMQ_LOGGER_HOST,
        port: 15672 || process.env.RMQ_LOGGER_PORT,
        password: 'guest' || process.env.RMQ_LOGGER_PASS,
        username: 'guest' || process.env.RMQ_LOGGER_USER,
        persistent: false,
    },
    rabbitMQ: {
        host: 'localhost',
        exchanges: {
            commentReceiver: 'comment',
            commentPublisher: 'comment',
        },
        reconnect_timeout: 1000,
    },
    server: {
        port: process.env.PORT ? +process.env.PORT : 5003,
        name: 'comment',
    },
    authentication: {
        required: false,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
};

const configuration: { [index: string]: Configuration } = {
    development,
    production,
    test,
};

export const config = configuration[process.env.NODE_ENV || 'development'];
