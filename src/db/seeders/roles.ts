
import { Roles } from '.prisma/client'
import { RoleSeed } from './types/seeders.types'

const RoleSeeder: RoleSeed[] = [
  {
    name: Roles.ADMIN,
    description: 'Platform administrator'
  },
  {
    name: Roles.USER,
    description: 'Platform user'
  }
]

export default RoleSeeder
