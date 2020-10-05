import { buildSchema } from "type-graphql"
import { Application } from "express"
import { ApolloServer, CorsOptions } from "apollo-server-express"
import config from '../config'
import resolvers from '../resolvers'

// Set the cors options
const cors: CorsOptions = {
  credentials: true,
  origin: config.ENV === 'production' ? config.ALLOWED_ORIGINS : '*'
}

export default async (app: Application) => {
  try {
    // Create Schema
    const schema = await buildSchema({
      resolvers
    })

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
    server.applyMiddleware({ app, cors })
    
    console.log('Apollo Initialized successfuylly ✅')
  } catch (e) {
    console.log('Error initializing Apollo: 💥')
    throw new Error(e)
  }
}