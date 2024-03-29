// import { Inject, Service } from 'typedi'
import config from 'config'
import SentryTransport from './sentryTransport'
import winston, { format, Logger } from 'winston'

const LoggerService = (): Logger => {
  const colors = {
    debug: 'white',
    info: 'cyan',
    error: 'red',
    http: 'white',
    silly: 'white',
    verbose: 'white',
    warn: 'yellow'
  }

  winston.addColors(colors)
  const level = config.LOG_LEVEL

  return winston.createLogger({
    level,
    transports: [
      new winston.transports.Console(),
      new SentryTransport()
    ],
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.colorize({ all: true }),
      format.printf((info) => `${String(info.timestamp)} -- ${info.level}: ${info.message}`)
    )
  })
}

export default LoggerService()
