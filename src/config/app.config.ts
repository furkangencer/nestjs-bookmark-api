import * as Joi from 'joi';
import { Environment } from '../common/enums';

export const configValidationSchema = Joi.object().keys({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
});

export const config = () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL,
});
