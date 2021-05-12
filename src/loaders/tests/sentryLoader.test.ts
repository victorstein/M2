import config from '../../config'
import SentryLoader from '../sentryLoader'

describe('Sentry Loader', () => {
  it('Should start without problems', () => {
    config.ENV = 'production'
    const sentry = new SentryLoader('https://username@domain/123')
    console.log = jest.fn()

    expect(() => sentry.start()).not.toThrow()
    expect(console.log).toBeCalledWith('Sentry Initialized successfully ✅')
  })

  it('Should fail initialization when there\'s an invalid dsn', () => {
    const sentry = new SentryLoader('invalid')
    console.warn = jest.fn()
    sentry.start()
    expect(console.warn).toHaveBeenCalledWith('Error Initializing Sentry: 🚨 ->', 'Invalid Dsn')
  })
})

describe('Sentry Loader not production', () => {
  it('Should not run when environment is not production', () => {
    config.ENV = 'development'
    const sentry = new SentryLoader()
    console.log = jest.fn()
    sentry.start()
    expect(console.log).toHaveBeenCalledWith('Sentry not initialized environment is not production ⚠️')
  })
})
