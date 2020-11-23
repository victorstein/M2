import config from "config"
import ExpressLoader from "loaders/expressLoader"

describe('Express Loader', () => {
  it('Should run without errors in production', () => {
    config.ENV = 'production'
    const expressLoader = new ExpressLoader()
    console.log = jest.fn()

    expect(() => expressLoader.start()).not.toThrow()
    expect(console.log).toHaveBeenCalledWith('Express Initialized successfully ✅')
  })

  it('Should disable x-powered-by header in production', () => {
    config.ENV = 'production'
    const expressLoader = new ExpressLoader()
    expressLoader.app.disable = jest.fn()

    expressLoader.start()
    expect(expressLoader.app.disable).toHaveBeenCalledWith('x-powered-by')
  })

  it('Should invoke security middlewares in production', () => {
    config.ENV = 'production'
    const expressLoader = new ExpressLoader()
    expressLoader.app.use = jest.fn()

    expressLoader.start()
    expect(expressLoader.app.use).toHaveBeenCalledTimes(3)
  })

  it('Should run without errors in development', () => {
    config.ENV = 'development'
    const expressLoader = new ExpressLoader()
    console.log = jest.fn()

    expect(() => expressLoader.start()).not.toThrow()
    expect(console.log).toHaveBeenCalledWith('Express Initialized successfully ✅')
  })

  it('Should throw if there\'s an error', () => {
    config.ENV = 'production'
    const expressLoader = new ExpressLoader()
    expressLoader.app.use = jest.fn(() => { throw new Error('Failed') })
    console.log = jest.fn()

    expect(() => expressLoader.start()).toThrow('Failed')
    expect(console.log).toHaveBeenCalledWith('Error initializing Express: 💥 ->', 'Failed')
  })
})