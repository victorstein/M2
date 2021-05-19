import { PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import LoaderBase from './loaderBase'

@Service()
class PrismaLoader extends LoaderBase {
  async start (): Promise<PrismaClient> {
    try {
      const prisma = new PrismaClient()
      await prisma.$connect()

      this.logger.info('Prisma Initialized successfully ✅')

      return prisma
    } catch (e) {
      this.logger.error('Error initializing Prisma: 💥 ->', e.message)
      throw new Error(e)
    }
  }
}

export default PrismaLoader
