import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('localhost'),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().default('defaultAccessTokenSecret'),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().default('defaultRefreshTokenSecret'),
  JWT_EMAIL_TOKEN_SECRET: Joi.string().default('defaultEmailTokenSecret'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),
  JWT_EMAIL_TOKEN_EXPIRES_IN: Joi.string().default('7m'),

  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),

  MAIL_HOST: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),

  MYSQLDB_LOCAL_PORT: Joi.number().default(3307),
  MYSQLDB_DOCKER_PORT: Joi.number().default(3306),

  NODE_LOCAL_PORT: Joi.number().default(3000),
  NODE_DOCKER_PORT: Joi.number().default(8080),

  DATABASE_URL: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  JWT: {
    accessTokenSecret: envVars.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: envVars.JWT_REFRESH_TOKEN_SECRET,
    emailTokenSecret: envVars.JWT_EMAIL_TOKEN_SECRET,
    accessTokenExpiry: envVars.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiry: envVars.JWT_REFRESH_TOKEN_EXPIRES_IN,
    emailTokenExpiry: envVars.JWT_EMAIL_TOKEN_EXPIRES_IN,
  },
  database: {
    user: envVars.DB_USER,
    pass: envVars.DB_PASS,
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    url: envVars.DATABASE_URL,
  },
  mail: {
    host: envVars.MAIL_HOST,
    user: envVars.MAIL_USER,
    pass: envVars.MAIL_PASS,
  },
  nodePorts: {
    local: envVars.NODE_LOCAL_PORT,
    docker: envVars.NODE_DOCKER_PORT,
  },
  mysqlPorts: {
    local: envVars.MYSQLDB_LOCAL_PORT,
    docker: envVars.MYSQLDB_DOCKER_PORT,
  },
};
export default config;
