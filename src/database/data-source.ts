import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER || process.env.DB_USERNAME,
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.POSTGRES_DB || process.env.DB_NAME,
  entities: isDevelopment ? ['src/database/entities/*.entity{.ts,.js}'] : ['dist/database/entities/*.entity{.ts,.js}'],
  migrations: isDevelopment ? ['src/database/migrations/*{.ts,.js}'] : ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});