import { buildSchema } from 'type-graphql'
import { ApolloServer, CorsOptions } from 'apollo-server-express'
import config from '../config'
import resolvers from '../resolvers'
import Container, { Inject, Service } from 'typedi'
import { Application } from 'express'
import { ContainerTypes, Context, ILoader } from './types/loadersTypes'
import { Logger } from 'winston'
import ExpressLoader from './expressLoader'
import PrismaLoader from './prismaLoader'

@Service()
class ApolloLoader implements ILoader {
  corsOptions: CorsOptions

  constructor (
    private readonly express: ExpressLoader,
    private readonly prisma: PrismaLoader,
    @Inject(ContainerTypes.LOGGER) readonly logger: Logger
  ) {
    this.corsOptions = {
      credentials: true,
      origin: config.ENV === 'production' ? config.ALLOWED_ORIGINS : '*'
    }
  }

  async start (): Promise<Application> {
    try {
      // Create Schema
      const schema = await buildSchema({
        resolvers,
        container: Container
      })

      // Create a express app
      const app = this.express.start()

      // Connect the database
      await this.prisma.start()

      // Create the server
      const server = new ApolloServer({
        context: ({ req, res }): Context => {
          return { req, res }
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
      server.applyMiddleware({ app, cors: this.corsOptions })

      this.logger.info('Apollo Initialized successfully ✅')
      return app
    } catch (e) {
      this.logger.error('Error initializing Apollo: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default ApolloLoader
