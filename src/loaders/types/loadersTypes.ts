import { Request, Response } from 'express'
import { Logger } from 'winston'

export interface Context {
  req: Request
  res: Response
}

export const ContainerTypes = {
  // Util types
  LOGGER: Symbol.for('LOGGER'),
  NOTFOUND: Symbol.for('NOT_FOUND'),
  ROLE_SEEDER: Symbol.for('ROLE_SEEDER'),
  DISPATCHER: Symbol.for('DISPATCHER'),
  EMAIL_TRANSPORT: Symbol.for('EMAIL_TRANSPORT'),
  // Loader types
  APOLLO_LOADER: Symbol.for('APOLLO_LOADER'),
  EXPRESS_LOADER: Symbol.for('EXPRESS_LOADER'),
  MONGO_LOADER: Symbol.for('MONGO_LOADER'),
  EMAIL_LOADER: Symbol.for('EMAIL_LOADER'),
  SUBSCRIBER_LOADER: Symbol.for('SUBSCRIBER_LOADER'),
  LOADERS: Symbol.for('LOADERS'),
  // Service types
  USER_SERVICE: Symbol.for('USER_SERVICE'),
  ROLE_SERVICE: Symbol.for('ROLE_SERVICE'),
  PERMISSION_SERVICE: Symbol.for('PERMISSION_SERVICE'),
  EMAIL_SERVICE: Symbol.for('EMAIL_SERVICE'),
  // Model types
  USER_MODEL: Symbol.for('USER_MODEL'),
  ROLE_MODEL: Symbol.for('ROLE_MODEL'),
  PERMISSION_MODEL: Symbol.for('PERMISSION_MODEL'),
  // Context types
  USER_CONTEXT: Symbol.for('USER_CONTEXT')
}

export interface ILoader<T> {
  logger: Logger
  start: () => T
}
