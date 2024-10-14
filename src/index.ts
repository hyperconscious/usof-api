import config from './config/config';
import UsofServer from './app';
import { startupLogger } from './utils/logger';
import { AppDataSource } from './config/ormconfig';

async function start() {
  try {
    await AppDataSource.initialize();
    startupLogger.info('Database connection established successfully');
    const server = new UsofServer();
    server.start(config.port);
  } catch (error) {
    startupLogger.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

start();
