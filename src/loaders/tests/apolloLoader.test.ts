import "reflect-metadata"
import config from "config"
import ApolloLoader from "loaders/apolloLoader"
import ExpressLoader from "loaders/expressLoader"
import Container from "typedi"
import { GraphQLError } from "graphql"
import { ExpressContext } from "apollo-server-express/dist/ApolloServer"

const expressLoader = new ExpressLoader()

describe('Apollo Loader', () => {
  it('Should run without errors', async () => {
    const apolloLoader = new ApolloLoader(expressLoader)
    console.log = jest.fn()

    await expect(apolloLoader.start())
      .resolves.toBe(expressLoader.start())
    expect(console.log)
      .toHaveBeenCalledWith('Apollo Initialized successfully ✅')
  })

  it('Should throw if buildSchema method fails', async () => {
    const apolloLoader = new ApolloLoader(expressLoader)

    const mockResolver = jest.fn()

    await expect(apolloLoader.buildSchema([mockResolver], Container))
      .rejects.toThrow('Failed Building the schema')
  })

  it('Should format the error when there\'s an argument validation error', () => {
    const apolloLoader = new ApolloLoader(expressLoader)

    const mockError = {
      message: "argument validation error",
      extensions: {
        exception: {
          validationErrors: [
            { constraints: ["Error1"] },
            { constraints: ["Error2"] }
          ]
        },
        code: "Error"
      }
    } as unknown as GraphQLError

    const expectedError = {
      message: [
        "Error1",
        "Error2"
      ],
      extensions: {
        ...mockError.extensions,
        code: "BAD_REQUEST"
      }
    } as unknown as GraphQLError

    expect(apolloLoader.formatError(mockError)).toEqual(expectedError)
  })

  it('Should not format the error when there\'s no argument validation error', () => {
    const apolloLoader = new ApolloLoader(expressLoader)

    const error = {
      message: "Error"
    } as unknown as GraphQLError

    expect(apolloLoader.formatError(error)).toEqual(error)
  })
  
  it('Should inject the req and res objects to the context', () => {
    const apolloLoader = new ApolloLoader(expressLoader)

    const mockExpressContext = {
      req: 'Mock',
      res: 'Mock',
      connection: {}
    } as unknown as ExpressContext

    const context = apolloLoader.contextCreator(mockExpressContext)

    // Check if keys are included
    expect(context).toHaveProperty('req', 'Mock')
    expect(context).toHaveProperty('res', 'Mock')
  })

  it('Should throw if createApolloServer method fails', async () => {
    const apolloLoader = new ApolloLoader(expressLoader)

    apolloLoader.buildSchema = jest.fn(() => { throw new Error('Failed') })

    await expect(apolloLoader.createApolloServer())
      .rejects.toThrow('Failed creating the server')
  })

  it('Should use the env origins in cors options when env is production', () => {
    config.ENV = 'production'
    config.ALLOWED_ORIGINS = ['test1.com','test2.com']
    const apolloLoader = new ApolloLoader(expressLoader)

    expect(apolloLoader.corsOptions)
      .toEqual({ credentials: true, origin: ['test1.com','test2.com'] })
  })

  it('Should allow access from any origin if env is not production', () => {
    config.ENV = 'development'
    const apolloLoader = new ApolloLoader(expressLoader)

    expect(apolloLoader.corsOptions)
      .toEqual({ credentials: true, origin: '*' })
  })

  it('Should throw if there\'s an error when starting the loader', async () => {
    const expressLoader = new ExpressLoader()
    console.log = jest.fn()
    expressLoader.start = jest.fn(() => { throw new Error('Failed') })
    const apolloLoader = new ApolloLoader(expressLoader)

    await expect(apolloLoader.start())
      .rejects.toThrow('Failed')
    expect(console.log)
      .toHaveBeenCalledWith('Error initializing Apollo: 💥 ->', 'Failed')
  })
})