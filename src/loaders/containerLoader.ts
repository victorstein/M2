import LoggerService from 'lib/logger'
import notFound from 'lib/middlewares/notFound'
import { Logger } from 'winston'
import { ContainerTypes, ILoader } from './types/loadersTypes'
import { mock } from 'jest-mock-extended'
import { RequestHandler } from 'express-serve-static-core'
import config from 'config'
import ExpressLoader from './expressLoader'
import MongoLoader from './mongoLoader'
import { Container, injectable } from 'inversify'
import Loaders from 'loaders'
import { UserService } from 'services/userService'
import { getModelForClass } from '@typegoose/typegoose'
import { RoleService } from 'services/roleService'
import User from 'db/models/user'
import Role from 'db/models/role'
import ApolloLoader from './apolloLoader'
import { RoleSeeder } from 'db/seeder/roleSeed'
import { EmailLoader } from './emailLoader'
import { EmailService } from 'services/emailService'
import { EventDispatcher } from 'lib/decorators/EventSubscriber'
import { SubscriberLoader } from './subscriberLoader'

@injectable()
class ContainerLoader extends Container implements ILoader<void> {
  logger: Logger

  constructor () {
    super({ autoBindInjectable: true })
    this.logger = LoggerService
  }

  private setAPPScopes (): void {
    // Context injection
    this.bind(ContainerTypes.USER_CONTEXT).toConstantValue(undefined)
    // Utility injections
    this.bind(ContainerTypes.LOGGER).toConstantValue(LoggerService)
    this.bind(ContainerTypes.NOTFOUND).toConstantValue(notFound)
    this.bind(ContainerTypes.ROLE_SEEDER).to(RoleSeeder)
    this.bind(ContainerTypes.DISPATCHER).to(EventDispatcher)
    // Loader injections
    this.bind(ContainerTypes.EXPRESS_LOADER).to(ExpressLoader)
    this.bind(ContainerTypes.APOLLO_LOADER).to(ApolloLoader)
    this.bind(ContainerTypes.MONGO_LOADER).to(MongoLoader)
    this.bind(ContainerTypes.EMAIL_LOADER).to(EmailLoader)
    this.bind(ContainerTypes.SUBSCRIBER_LOADER).to(SubscriberLoader)
    this.bind(ContainerTypes.LOADERS).to(Loaders)
    // Service injections
    this.bind(ContainerTypes.USER_SERVICE).to(UserService)
    this.bind(ContainerTypes.ROLE_SERVICE).to(RoleService)
    this.bind(ContainerTypes.EMAIL_SERVICE).to(EmailService)
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
    try {
      if (config.ENV === 'test') this.setTestScopes()
      else this.setAPPScopes()
      this.logger.info('Container Initialized successfully ✅')
    } catch ({ message }) {
      this.logger.error(`Error initializing Container: 💥 -> ${message as string}`)
      throw new Error(message)
    }
  }
}

export default new ContainerLoader()
