import config from './config/env.config';
import UsofServer from './app';
import { startupLogger } from './utils/logger';

function start() {
  try {
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
