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