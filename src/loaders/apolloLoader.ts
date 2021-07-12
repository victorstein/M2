import { buildSchema } from 'type-graphql'
import { ApolloServer, CorsOptions } from 'apollo-server-express'
import config from '../config'
import { ContainerTypes, Context, ILoader } from './types/loadersTypes'
import { Logger } from 'winston'
import { inject, injectable } from 'inversify'
import containerLoader from './containerLoader'
import { join } from 'path'

@injectable()
class ApolloLoader implements ILoader<Promise<ApolloServer>> {
  corsOptions: CorsOptions
  @inject(ContainerTypes.LOGGER)
  logger: Logger

  async start (): Promise<ApolloServer> {
    try {
      // Create Schema
      const schema = await buildSchema({
        resolvers: [join(__dirname, '..', 'resolvers/**/*.ts')],
        container: containerLoader
      })

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

      this.logger.info('Apollo Initialized successfully ✅')
      return server
    } catch ({ message }) {
      this.logger.error(`Error initializing Apollo: 💥 -> ${message as string}`)
      throw new Error(message)
    }
  }
}

export default ApolloLoader
