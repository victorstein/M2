import { buildSchema, ContainerType, NonEmptyArray } from "type-graphql"
import { ApolloServer, CorsOptions } from "apollo-server-express"
import config from 'config'
import resolvers from 'resolvers'
import Container, { Service } from "typedi"
import { Application } from "express"
import ExpressLoader from "loaders/expressLoader"
import { GraphQLError, GraphQLSchema } from "graphql"
import { ExpressContext } from "apollo-server-express/dist/ApolloServer"

@Service()
export default class ApolloLoader {
  corsOptions: CorsOptions

  constructor (private express: ExpressLoader) {
    this.corsOptions = {
      credentials: true,
      origin: config.ENV === 'production' ? config.ALLOWED_ORIGINS : '*'
    }
  }

  async buildSchema (resolvers: NonEmptyArray<Function>, container: ContainerType): Promise<GraphQLSchema> {
    try {
      const schema = await buildSchema({
        resolvers,
        container
      })
      return schema
    } catch (e) {
      throw new Error(`Failed Building the schema: ${e.message}`)
    }
  }

  formatError (err: GraphQLError): GraphQLError {
    const message = err.message.toLowerCase()
    /* Send class validator errors in graphQL Errors */
    if (message.includes('argument validation error')) {
      const error = err.extensions!.exception.validationErrors.map((u: any) => u.constraints)
      err.message = error.flatMap((u : any) => Object.values(u))
      err.extensions!.code = 'BAD_REQUEST'
    }
    return err
  }

  contextCreator (context: ExpressContext) {
    const { req, res } = context
    return { req, res }
  }

  async createApolloServer (): Promise<ApolloServer> {
    try {
      // Create Schema
      const schema = await this.buildSchema(resolvers, Container)

      return new ApolloServer({
        context: this.contextCreator,
        playground: config.ENV !== 'production',
        schema,
        debug: config.ENV !== 'production',
        formatError: this.formatError
      })
    } catch (e) {
      throw new Error(`Failed creating the server: ${e.message}`)
    }
  }

  async start (): Promise<Application> {
    try {
      // Create a express app
      const app = this.express.start()

      // Create the server
      const server = await this.createApolloServer()
  
      // Apply the express app to the apollo server
      server.applyMiddleware({ app, cors: this.corsOptions })
      
      console.log('Apollo Initialized successfully ✅')
      return app
    } catch (e) {
      console.log('Error initializing Apollo: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}