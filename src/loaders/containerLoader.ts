import LoggerService from 'lib/logger'
import notFound from 'lib/middlewares/notFound'
import { Logger } from 'winston'
import { ContainerTypes, ILoader, LoaderTypes } from './types/loadersTypes'
import { mock } from 'jest-mock-extended'
import { RequestHandler } from 'express-serve-static-core'
import config from 'config'
import ExpressLoader from './expressLoader'
import MongoLoader from './mongoLoader'
import { Container, decorate, injectable } from 'inversify'
import Loaders from 'loaders'
import { UserService } from 'services/userService'
import { getModelForClass } from '@typegoose/typegoose'
import { RoleService } from 'services/roleService'
import User from 'db/models/user'
import Role from 'db/models/role'
import ApolloLoader from './apolloLoader'
import { RoleSeeder } from 'db/seeder/roleSeed'
import { EventDispatcher } from 'event-dispatch'

// Load subscriber dependencies
import 'subscribers/emailSubscriber'

class ContainerLoader extends Container implements ILoader<LoaderTypes.VOID> {
  logger: Logger
  containerInstance: Container

  constructor () {
    super({ autoBindInjectable: true })
    this.logger = LoggerService
  }

  private setAPPScopes (): void {
    // Decorate class coming from dependency
    decorate(injectable(), EventDispatcher)

    // Context injection
    this.bind(ContainerTypes.USER_CONTEXT).toConstantValue(undefined)
    // Utility injections
    this.bind(ContainerTypes.LOGGER).toConstantValue(LoggerService)
    this.bind(ContainerTypes.NOTFOUND).toConstantValue(notFound)
    this.bind(ContainerTypes.ROLE_SEEDER).to(RoleSeeder)
    this.bind(ContainerTypes.DISPATCHER).to(EventDispatcher)
    // Loader injections
    this.bind<ILoader<LoaderTypes.EXPRESS>>(ContainerTypes.EXPRESS_LOADER).to(ExpressLoader)
    this.bind<ILoader<LoaderTypes.APOLLO>>(ContainerTypes.APOLLO_LOADER).to(ApolloLoader)
    this.bind<ILoader<LoaderTypes.VOID>>(ContainerTypes.MONGO_LOADER).to(MongoLoader)
    this.bind(ContainerTypes.LOADERS).to(Loaders)
    // Service injections
    this.bind(ContainerTypes.USER_SERVICE).to(UserService)
    this.bind(ContainerTypes.ROLE_SERVICE).to(RoleService)
    // Model injections
    this.bind(ContainerTypes.USER_MODEL).toConstantValue(getModelForClass(User))
    this.bind(ContainerTypes.ROLE_MODEL).toConstantValue(getModelForClass(Role))
    this.logger.verbose('Set app scopes')
  }

  private setTestScopes (): void {
    this.bind(ContainerTypes.LOGGER).toConstantValue(mock<Logger>())
    this.bind(ContainerTypes.NOTFOUND).toConstantValue(mock<RequestHandler>())

    this.logger.verbose('Set test scopes')
  }

  start (): void {
    if (config.ENV === 'test') this.setTestScopes()
    else this.setAPPScopes()
    this.logger.info('Container Initialized successfully ✅')
  }
}

export default new ContainerLoader()
