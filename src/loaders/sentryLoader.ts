import * as Sentry from '@sentry/node'
import { Service } from 'typedi';
import config from '../config';

@Service()
export default class SentryLoader {
  dsn: string
  serverName: string
  constructor () {
    this.dsn = config.SENTRY_DSN
    this.serverName = config.SENTRY_SERVER_NAME
  }

  start () {
    try {
      // If not in production don't activate Sentry
      if (config.ENV !== 'production') {
        console.log('Sentry not initialized environment is not production ⚠️')
        return
      }

      // Initialize Sentry
      Sentry.init({
        dsn: this.dsn,
        serverName: this.serverName
      }) 
      console.log('Sentry Initialized successfuylly ✅')
    } catch (e) {
      console.log(e)
      console.warn('Error Initializing Sentry: 🚨 ->', e.message)
    }
  }
}