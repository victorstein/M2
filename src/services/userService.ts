import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import argon2 from 'argon2'
import { Roles } from 'db/models/types/modelsTypes'
import User from 'db/models/user'
import generator from 'generate-password'
import { inject, injectable } from 'inversify'
import { ContainerTypes } from 'loaders/types/loadersTypes'
import { RoleService } from './roleService'
import { Service } from './service'

@injectable()
export class UserService extends Service<User> {
  @inject(ContainerTypes.USER_MODEL)
  model: ModelType<User>

  @inject(ContainerTypes.ROLE_SERVICE)
  roleService: RoleService

  async findOneByRole (role: Roles): Promise<DocumentType<User> | null> {
    this.logger.verbose(`Operation: findOneByRole. \n role: ${role}`)
    const foundRole = await this.roleService.findOneByParam({ type: role })
    if (foundRole === null) return null
    return await this.model.findOne({ role: foundRole._id })
  }

  generateTemporaryPassword (): string {
    this.logger.verbose('Generating temporary password')
    return generator.generate({
      length: 15,
      numbers: true,
      strict: true
    })
  }

  async hashPassword (password: string): Promise<string> {
    this.logger.verbose('Hashing temporary password')
    return await argon2.hash(password, { type: argon2.argon2i })
  }
}
