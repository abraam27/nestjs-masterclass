import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  type: process.env.DATABASE_TYPE,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD_ENTITIES === 'true' || false,
  synchronize: process.env.DATABASE_SYNC === 'true' || false,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
}));
