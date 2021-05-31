import { buildSchema } from 'type-graphql'
import { ApolloServer, CorsOptions } from 'apollo-server-express'
import config from '../config'
import resolvers from '../resolvers'
import Container, { Service } from 'typedi'
import ExpressLoader from './expressLoader'
import { Context } from './types/loaders.types'
import PrismaLoader from './prismaLoader'
import LoaderBase from './loaderBase'

@Service()
class ApolloLoader extends LoaderBase {
  corsOptions: CorsOptions

  constructor (
    private readonly express: ExpressLoader,
    private readonly prisma: PrismaLoader
  ) {
    super()
    this.corsOptions = {
      credentials: true,
      origin: config.ENV === 'production' ? config.ALLOWED_ORIGINS : '*'
    }
  }

  async start (): Promise<void> {
    try {
      // Create Schema
      const schema = await buildSchema({
        resolvers,
        container: Container
      })

      // Create a express app
      this.express.start()

      // Connect the database
      await this.prisma.start()

      // Create the server
      const server = new ApolloServer({
        context: ({ req, res }): Context => {
          return { req, res, prisma: this.prisma.client }
        },
        playground: config.ENV !== 'production',
        schema,
        debug: config.ENV !== 'production',
        formatError: (err) => {
          const message = err.message.toLowerCase()
          /* Send class validator errors in graphQL Errors */
          if (message.includes('argument validation error')) {
            const error = err.extensions?.exception.validationErrors.map((u: any) => u.constraints)
            err.message = error.flatMap((u: any) => Object.values(u))
            if (err.extensions !== undefined) err.extensions.code = 'BAD_REQUEST'
          }
          return err
        }
      })

      // Apply the express app to the apollo server
      server.applyMiddleware({ app: this.express.app, cors: this.corsOptions })

      this.logger.info('Apollo Initialized successfully ✅')
    } catch (e) {
      this.logger.error('Error initializing Apollo 💥')
      throw new Error(e.message)
    }
  }
}

export default ApolloLoader
