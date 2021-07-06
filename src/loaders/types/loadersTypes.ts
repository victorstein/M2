import { ApolloServer } from 'apollo-server-express'
import { Application, Request, Response } from 'express'
import { Logger } from 'winston'

export interface Context {
  req: Request
  res: Response
}

export const ContainerTypes = {
  // Util types
  LOGGER: Symbol.for('LOGGER'),
  NOTFOUND: Symbol.for('NOT_FOUND'),
  // Loader types
  APOLLO_LOADER: Symbol.for('APOLLO_LOADER'),
  EXPRESS_LOADER: Symbol.for('EXPRESS_LOADER'),
  MONGO_LOADER: Symbol.for('MONGO_LOADER'),
  LOADERS: Symbol.for('LOADERS'),
  // Service types
  BASE_SERVICE: Symbol.for('BASE_SERVICE'),
  USER_SERVICE: Symbol.for('USER_SERVICE'),
  // Model types
  USER_MODEL: Symbol.for('USER_MODEL'),
  ROLE_MODEL: Symbol.for('ROLE_MODEL'),
  PERMISSION_MODEL: Symbol.for('PERMISSION_MODEL')
}

export enum LoaderTypes {
  'APOLLO' = 'Apollo',
  'EXPRESS' = 'Express',
  'VOID' = 'void'
}

export interface Loaders {
  Apollo: () => Promise<ApolloServer>
  Express: () => Application
  void: () => void | Promise<void>
}

export interface ILoader<T extends keyof Loaders> {
  logger: Logger
  start: Loaders[T]
}
