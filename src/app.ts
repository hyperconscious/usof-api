import express from 'express';
import 'reflect-metadata';
import cors from 'cors';
import { startupLogger } from './utils/logger';
import { Request, Response, NextFunction } from 'express';
import requestLogger from './middlewares/request-loger.middleware';
import { router as apiRoutes } from './routes/index.routes';
import { AppDataSource } from './config/ormconfig';
import { databaseService } from './services/database.service';

class UsofServer {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    startupLogger.info('Server initialized');
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(requestLogger);
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      startupLogger.info('Database connection established successfully');
    } catch (error) {
      startupLogger.error('Failed to initialize database connection');
      startupLogger.error(`Error details: ${error}`);
      throw new Error('Database connection failed');
    }
  }

  private configureRoutes(): void {
    this.app.use('/', apiRoutes.get('/'));
    this.app.use('/api', apiRoutes);
  }

  private configureErrorHandling(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        startupLogger.error(`Error: ${err.message}`);
        res.status(500).send('Internal Server Error');
      },
    );
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
