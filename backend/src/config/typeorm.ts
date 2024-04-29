import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { MainSeeder } from '../seed/MainSeeder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: parseInt(process.env.DB_PORT),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  autoLoadEntities: true,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  entities: [User],
  seeds: [MainSeeder],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
