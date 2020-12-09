import 'reflect-metadata'
import Loaders from "loaders"
import ApolloLoader from "loaders/apolloLoader"
import ExpressLoader from "loaders/expressLoader"
import SentryLoader from "loaders/sentryLoader"

describe('Loaders Index Tests', () => {
  const app = new ExpressLoader()
  const apolloLoader = new ApolloLoader(app)

  it('Should throw if there\'s an Error', async () => {
    const sentryLoader = new SentryLoader()
    sentryLoader.start = jest.fn(() => { throw new Error('Failed') })
    const mainLoader = new Loaders(sentryLoader, apolloLoader)
    await expect(mainLoader.load())
      .rejects.toThrow('There was an error initializing your loaders')
  })

  it('Should return the app if everything loaded successfully', async () => {
    const sentryLoader = new SentryLoader()
    const mainLoader = new Loaders(sentryLoader, apolloLoader)
    const { app: expressApp } = app

    await expect(mainLoader.load())
      .resolves.toBe(expressApp)
  })
})