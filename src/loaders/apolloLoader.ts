import { buildSchema } from "type-graphql"
import { ApolloServer, CorsOptions } from "apollo-server-express"
import config from '../config'
import resolvers from '../resolvers'
import Container, { Service } from "typedi"
import { Application } from "express"
import ExpressLoader from "./expressLoader"

@Service()
export default class ApolloLoader {
  corsOptions: CorsOptions

  constructor (private express: ExpressLoader) {
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

      // Create the server
      const server = new ApolloServer({
        context: ({ req, res }) => {
          return { req, res }
        },
        playground: config.ENV !== 'production',
        schema,
        debug: config.ENV !== 'production',
        formatError: (err) => {
          const message = err.message.toLowerCase()
          /* Send class validator errors in graphQL Errors */
          if (message.includes('argument validation error')) {
            const error = err.extensions!.exception.validationErrors.map((u: any) => u.constraints)
            err.message = error.flatMap((u : any) => Object.values(u))
            err.extensions!.code = 'BAD_REQUEST'
          }
          return err
        }
      })
  
      // Apply the express app to the apollo server
      server.applyMiddleware({ app, cors: this.corsOptions })
      
      console.log('Apollo Initialized successfuylly ✅')
      return app
    } catch (e) {
      console.log('Error initializing Apollo: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}