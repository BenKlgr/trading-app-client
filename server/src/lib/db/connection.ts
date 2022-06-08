import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { Placement } from './models/Placement';
import { User } from './models/User';
import { Notification } from './models/Notification';

config();
const {
  DATABASE,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_DIALECT,
  DATABASE_LOGGING,
} = process.env;

export const connection = new Sequelize({
  database: DATABASE,
  dialect: DATABASE_DIALECT as any,
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  // models: [__dirname + '/models'],
  models: [User, Placement, Notification],
  logging: DATABASE_LOGGING == 'true',
});
