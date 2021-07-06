import LoggerService from 'lib/logger'
import notFound from 'lib/middlewares/notFound'
import { Logger } from 'winston'
import { ContainerTypes, ILoader, LoaderTypes } from './types/loadersTypes'
import { mock } from 'jest-mock-extended'
import { RequestHandler } from 'express-serve-static-core'
import config from 'config'
import ApolloLoader from './apolloLoader'
import ExpressLoader from './expressLoader'
import MongoLoader from './mongoLoader'
import { Container } from 'inversify'
import Loaders from 'loaders'
import BaseService from 'services/baseService'
import { UserService } from 'services/userService'
import User from 'db/models/user'
import Role from 'db/models/role'
import Permission from 'db/models/permission'

class ContainerLoader extends Container implements ILoader<LoaderTypes.VOID> {
  logger: Logger
  containerInstance: Container

  constructor () {
    super({ autoBindInjectable: true })
    this.logger = LoggerService
  }

  private setAPPScopes (): void {
    // Utility injections
    this.bind(ContainerTypes.LOGGER).toConstantValue(LoggerService)
    this.bind(ContainerTypes.NOTFOUND).toConstantValue(notFound)
    // Loader injections
    this.bind<ILoader<LoaderTypes.EXPRESS>>(ContainerTypes.EXPRESS_LOADER).to(ExpressLoader)
    this.bind<ILoader<LoaderTypes.APOLLO>>(ContainerTypes.APOLLO_LOADER).to(ApolloLoader)
    this.bind<ILoader<LoaderTypes.VOID>>(ContainerTypes.MONGO_LOADER).to(MongoLoader)
    this.bind(ContainerTypes.LOADERS).to(Loaders)
    // Service injections
    this.bind(ContainerTypes.BASE_SERVICE).to(BaseService)
    this.bind(ContainerTypes.USER_SERVICE).to(UserService)
    // Model injections
    this.bind(ContainerTypes.USER_MODEL).to(User)
    this.bind(ContainerTypes.ROLE_MODEL).to(Role)
    this.bind(ContainerTypes.PERMISSION_MODEL).to(Permission)

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
