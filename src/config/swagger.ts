import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const setupSwagger = (app: express.Application) => {
  const swaggerDocument = YAML.load(
    path.resolve(__dirname, '../../docs/open-api.yaml'),
  );

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
