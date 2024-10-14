import express from 'express';
import cors from 'cors';
import { startupLogger } from './utils/logger';
import { Request, Response, NextFunction } from 'express';
import requestLogger from './middlewares/requestLoger';
import { router as apiRoutes } from './routes/index';

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

  public start(port: number): void {
    this.app.listen(port, () => {
      startupLogger.info(`Server is running on http://localhost:${port}`);
    });
  }
}

export default UsofServer;
