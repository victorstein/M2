import 'dotenv/config'
import { LogLevel } from 'lib/logger/types/loggerServiceTypes'

const {
  /* GENERAL VARIABLES */
  PORT,
  NODE_ENV,
  ADMIN_EMAIL,
  TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  DB_URL,
  QUERY_COMPLEXITY_LIMIT,
  RATE_LIMIT_BAN_EXP,
  /* EMAIL SERVICE VARIABLES */
  EMAIL_PROVIDER_HOST,
  EMAIL_PROVIDER_TLS_PORT,
  EMAIL_PROVIDER_SSL_PORT,
  EMAIL_PROVIDER_USER,
  EMAIL_PROVIDER_PASS,
  EMAIL_VERIFICATION_EXP,
  EMAIL_PASSWORD_REQUEST_EXP,
  ALLOWED_ORIGINS,
  /* SENTRY SERVICE VARIABLES */
  SENTRY_DSN,
  SENTRY_SERVER_NAME,
  /* LOGGER UTIL */
  LOG_LEVEL
} = process.env

export default {
  PORT: PORT !== undefined ? Number(PORT) : 3002,
  ENV: NODE_ENV ?? 'development',
  ADMIN_EMAIL: ADMIN_EMAIL ?? null,
  TOKEN_SECRET: TOKEN_SECRET ?? null,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET ?? null,
  TOKEN_EXP: TOKEN_EXP ?? '15m',
  REFRESH_TOKEN_EXP: REFRESH_TOKEN_EXP ?? '1d',
  DB_URL: DB_URL ?? '',
  QUERY_COMPLEXITY_LIMIT: QUERY_COMPLEXITY_LIMIT ?? 20,
  RATE_LIMIT_BAN_EXP: RATE_LIMIT_BAN_EXP ?? '1d',
  EMAIL_PROVIDER_HOST: EMAIL_PROVIDER_HOST ?? 'smtp.gmail.com',
  EMAIL_PROVIDER_TLS_PORT: EMAIL_PROVIDER_TLS_PORT ?? 587,
  EMAIL_PROVIDER_SSL_PORT: EMAIL_PROVIDER_SSL_PORT ?? 465,
  EMAIL_PROVIDER_USER: EMAIL_PROVIDER_USER ?? null,
  EMAIL_PROVIDER_PASS: EMAIL_PROVIDER_PASS ?? null,
  EMAIL_VERIFICATION_EXP: EMAIL_VERIFICATION_EXP ?? '1w',
  EMAIL_PASSWORD_REQUEST_EXP: EMAIL_PASSWORD_REQUEST_EXP ?? '1d',
  ALLOWED_ORIGINS: ALLOWED_ORIGINS !== undefined ? ALLOWED_ORIGINS.split(',') : '*',
  SENTRY_DSN: SENTRY_DSN ?? 'invalid',
  SENTRY_SERVER_NAME: SENTRY_SERVER_NAME ?? '',
  LOG_LEVEL: LOG_LEVEL ?? (() => {
    switch (process.env.NODE_ENV) {
      case 'production': return LogLevel.ERROR
      case 'development': return LogLevel.SILLY
      default: return LogLevel.INFO
    }
  })()
}
