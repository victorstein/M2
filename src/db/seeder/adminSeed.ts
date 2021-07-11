import { mongoose } from '@typegoose/typegoose'
import config from 'config'
import { Roles } from 'db/models/types/modelsTypes'
import { inject, injectable } from 'inversify'
import ContainerLoader from 'loaders/containerLoader'
import MongoLoader from 'loaders/mongoLoader'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { RoleService } from 'services/roleService'
import { UserService } from 'services/userService'
import { Event, EventDispatcher, ISendTemporaryPasswordEmail } from 'subscribers/types/subscriberTypes'
import { Logger } from 'winston'
import { RoleSeeder } from './roleSeed'
import { ConnectionState, ISeeder } from './types/seederTypes'

@injectable()
export class AdminSeed implements ISeeder {
  @inject(ContainerTypes.LOGGER) logger: Logger
  @inject(ContainerTypes.USER_SERVICE) userService: UserService
  @inject(ContainerTypes.ROLE_SERVICE) roleService: RoleService
  @inject(ContainerTypes.ROLE_SEEDER) roleSeeder: RoleSeeder
  @inject(ContainerTypes.DISPATCHER) dispatcher: EventDispatcher

  async seed (): Promise<void> {
    try {
      this.logger.verbose('Looking for admin user')
      const admin = await this.userService.findOneByRole(Roles.ADMIN)

      if (admin === null) {
        this.logger.verbose('Admin user was not found.')

        this.logger.verbose('Check if admin email on .env')
        if (config.ADMIN_EMAIL === null) throw new Error('Database seed error. ADMIN_EMAIL not set in .env file.')

        this.logger.verbose('Checking if ADMIN role exists...')
        let adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        if (adminRole === null) {
          this.logger.verbose('Admin role not found. Creating Base roles...')
          await this.roleSeeder.seed()
        }

        adminRole = await this.roleService.findOneByParam({ name: Roles.ADMIN })

        const password = this.userService.generateTemporaryPassword()
        const hashedPassword = await this.userService.hashPassword(password)

        this.logger.verbose('Add user to DB')
        const admin = await this.userService.create({
          firstName: 'admin',
          lastName: 'admin',
          email: config.ADMIN_EMAIL,
          password: hashedPassword,
          role: adminRole?._id
        })

        this.dispatcher.dispatch<ISendTemporaryPasswordEmail>(
          Event.SEND_TEMPORARY_PASSWORD_EMAIL,
          { user: admin, temporaryPassword: password }
        )
        return
      }

      this.logger.verbose('There\'s an existing admin user in the DB. New admin not created.')
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
