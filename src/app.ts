import express from 'express';
import 'reflect-metadata';
import 'express-async-errors';
import cors from 'cors';
import { startupLogger } from './utils/logger';
import requestLogger from './middlewares/request-loger.middleware';
import { router as apiRoutes } from './routes/index.routes';
import { databaseService } from './services/database.service';
import { errorMiddleware } from './middlewares/error-handle.middleware';
import { NotFoundError } from './utils/http-errors';
import path from 'path';
import setupSwagger from './docs/swagger';

class UsofServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    setupSwagger(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    startupLogger.info('Server initialized');
  }

  private configureMiddleware(): void {
    const uploadsPath = path.resolve(__dirname, '../uploads');
    this.app.use('/uploads', express.static(uploadsPath));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(requestLogger);
  }

  private configureRoutes(): void {
    // this.app.use('/', apiRoutes.get('/'));
    this.app.use('/api', apiRoutes);
  }

  private configureErrorHandling(): void {
    this.app.use((req, res, next) => next(new NotFoundError()));
    this.app.use(errorMiddleware);
  }

  public async start(port: number): Promise<void> {
    try {
      await databaseService.connectWithRetries();
      this.app.listen(port, () => {
        startupLogger.info(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      startupLogger.error(
        'Unable to start server due to database connection failure',
      );
    }
  }
}

export default UsofServer;
