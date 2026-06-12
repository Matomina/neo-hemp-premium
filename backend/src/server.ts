import { ENV } from './config/env';
import { logger } from './utils/logger';
import app from './app';

app.listen(ENV.PORT, () => {
  logger.info(`Culture Bio Diamant API listening on port ${ENV.PORT}`);
  logger.info(`Environment: ${ENV.NODE_ENV}`);
  logger.info('Notice: payment integration NOT active');
});
