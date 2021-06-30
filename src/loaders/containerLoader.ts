import logger from 'lib/logger'
import notFound from 'middlewares/notFound'
import Container from 'typedi'
import { Logger } from 'winston'
import { ContainerTypes } from './types/loadersTypes'
import { mock } from 'jest-mock-extended'
import { RequestHandler } from 'express-serve-static-core'
import config from 'config'

class ContainerLoader {
  private setAPPScopes (): void {
    // App Scope
    Container.set(ContainerTypes.LOGGER, logger)
    Container.set(ContainerTypes.NOTFOUND, notFound)
  }

  private setTestScopes (): void {
    // Test Scope
    Container.set(ContainerTypes.LOGGER, mock<Logger>())
    Container.set(ContainerTypes.NOTFOUND, mock<RequestHandler>())
  }

  start (): void {
    if (config.ENV === 'test') this.setTestScopes()
    else this.setAPPScopes()
    logger.info('Container Initialized successfully ✅')
  }
}

export default ContainerLoader
