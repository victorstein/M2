
import { RoleCreateWithoutPermissionsInput, Roles } from 'generated'

const RoleSeeder: RoleCreateWithoutPermissionsInput[] = [
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
