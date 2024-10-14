import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('localhost'),

  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),

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
  database: {
    user: envVars.DB_USER,
    pass: envVars.DB_PASS,
    name: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    url: envVars.DATABASE_URL,
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
