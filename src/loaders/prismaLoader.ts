import { PrismaClient } from '@prisma/client'
import { Inject, Service } from 'typedi'
import { Logger } from 'winston'
import { ContainerTypes, ILoader } from './types/loadersTypes'

@Service()
class PrismaLoader implements ILoader {
  @Inject(ContainerTypes.LOGGER)
  logger: Logger

  async start (): Promise<void> {
    try {
      const prisma = new PrismaClient()
      await prisma.$connect()

      this.logger.info('Prisma Initialized successfully ✅')
    } catch (e) {
      this.logger.error('Error initializing Prisma: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default PrismaLoader
