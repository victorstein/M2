import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { RoleService } from 'services/roleService'
import { Logger } from 'winston'
import { ISeeder } from './types/seederTypes'
import { Roles } from 'db/models/types/modelsTypes'

@injectable()
export class RoleSeeder implements ISeeder {
  @inject(ContainerTypes.LOGGER) logger: Logger
  @inject(ContainerTypes.ROLE_SERVICE) roleService: RoleService

  async seed (): Promise<void> {
    for (const role of Object.values(Roles)) {
      const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1)
      await this.roleService.upsertByParam(
        { name: role },
        {
          description: `${capitalizedRole} role.`,
          name: role,
          type: role
        }
      )
    }
  }
}
