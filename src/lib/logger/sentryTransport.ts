import TransportStream from 'winston-transport'
import * as Sentry from '@sentry/node'
import config from 'config'
import { LogLevel } from './types/loggerServiceTypes'

class SentryTransport extends TransportStream {
  private readonly sentry: typeof Sentry

  constructor (dsn?: string, serverName?: string) {
    super()
    dsn = dsn ?? config.SENTRY_DSN
    serverName = serverName ?? config.SENTRY_SERVER_NAME
    this.sentry = Sentry
    this.initializeSentry(dsn, serverName)
  }

  private initializeSentry (dsn: string, serverName: string): void {
    try {
      this.sentry.init({ dsn, serverName, environment: config.ENV })
      console.log('Sentry Initialized successfully ✅')
    } catch (e) {
      console.log('Error Initializing Sentry: 🚨 ->', e.message)
    }
  }

  public log (info: any, callback: () => void): void {
    setImmediate(() => {
      this.emit('logged', info)
    })

    if (info[Symbol.for('level')] === LogLevel.ERROR) {
      const meta: any[] = info[Symbol.for('splat')]
      if (meta !== undefined) {
        this.sentry.setContext('Additional info', Object.assign({}, ...meta))
      }
      this.sentry.captureException(info)
    }
    return callback()
  }
}

export default SentryTransport
