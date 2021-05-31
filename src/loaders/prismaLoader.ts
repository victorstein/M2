import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import LoaderBase from './loaderBase'

@Service()
class PrismaLoader extends LoaderBase {
  client: PrismaClient

  invokeListeners (): void {
    this.client.$use(async (params, next) => {
      if (params.action === 'create' || params.action === 'createMany') {
        // TODO: Insert user from container info. Can't complete until Auth middleware is ready.
      }

      return await next(params)
    })
  }

  async start (): Promise<void> {
    try {
      const prisma = new PrismaClient()
      this.client = prisma

      this.invokeListeners()

      await prisma.$connect()

      this.logger.info('Prisma Initialized successfully ✅')
    } catch (e) {
      this.logger.error('Error initializing Prisma: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default PrismaLoader
