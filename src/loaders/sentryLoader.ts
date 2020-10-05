import * as Sentry from '@sentry/node'
import config from '../config';

export default () => {
  try {
    Sentry.init({
      dsn: config.SENTRY_DSN,
      serverName: config.SENTRY_SERVER_NAME
    });
    
    console.log('Sentry Initialized successfuylly ✅')
  } catch (e) {
    console.warn('Error Initializing Sentry: 🚨')
  }
}