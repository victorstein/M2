import { ModelType } from '@typegoose/typegoose/lib/types'
import Role from 'db/models/role'
import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { Service } from './service'

@injectable()
export class RoleService extends Service<Role> {
  @inject(ContainerTypes.ROLE_MODEL)
  model: ModelType<Role>
}
