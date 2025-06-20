import * as joi from 'joi';

export default joi.object({
    NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
    DATABASE_TYPE: joi.string().valid('postgres', 'mysql', 'sqlite', 'mssql').default('postgres'),
    DATABASE_HOST: joi.string().required().default('localhost'),
    DATABASE_PORT: joi.number().required().default(5432),
    DATABASE_USERNAME: joi.string().required().default('postgres'),
    DATABASE_PASSWORD: joi.string().required().default('postgres'),
    DATABASE_NAME: joi.string().required().default('nestjs-masterclass'),
    DATABASE_AUTOLOAD_ENTITIES: joi.boolean().default(false),
    DATABASE_SYNC: joi.boolean().default(false),
    PROFILE_API_KEY: joi.string().required()
})