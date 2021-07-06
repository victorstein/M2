import { mongoose } from '@typegoose/typegoose'
import config from 'config'
import { Roles } from 'db/models/types/modelsTypes'
import User from 'db/models/user'
import { inject, injectable } from 'inversify'
import ContainerLoader from 'loaders/containerLoader'
import MongoLoader from 'loaders/mongoLoader'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Logger } from 'winston'
import { ConnectionState, Seeder } from './types/seederTypes'

@injectable()
export class AdminSeed implements Seeder {
  @inject(ContainerTypes.USER_MODEL)
  user: User

  @inject(ContainerTypes.LOGGER)
  logger: Logger

  async seed (): Promise<void> {
    try {
      this.logger.verbose('Looking for admin user')
      const admin = await this.user.model.findOne({ 'role.name': Roles.USER })

      if (admin === null) {
        this.logger.verbose('Admin user was not found. Creating admin user.')
        await this.user.model.create({
          firstName: 'admin',
          lastName: 'admin',
          email: config.ADMIN_EMAIL
        })
        return
      }

      this.logger.verbose(`There's an existing admin user in the DB. New admin not created. Please consult with ${admin.email}`)
    } catch (e) {
      this.logger.error(`There was an error seeding the DB: ${e.message as string}`)
      throw new Error(e.message)
    }
  }
}

(async () => {
  // Start the container
  const container = ContainerLoader
  container.start()
  const adminSeed = container.get(AdminSeed)
  const mongoLoader = container.get(MongoLoader)

  // Start db connection
  if (mongoose.connection.readyState === ConnectionState.DISCONNECTED) {
    await mongoLoader.start()
  }

  // Start container
  await adminSeed.seed()
})()
  .then(() => process.exit())
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
