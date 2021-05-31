import { Permission } from '.prisma/client'
import { Role } from '../../../generated'

export interface PermissionSeed extends Omit<Permission, 'id' | 'createdAt' | 'updatedAt'> {}
export interface RoleSeed extends Omit<Role, 'id' | 'createdAt' | 'updatedAt'>{}

export const operations = [
  'create',
  'read',
  'update',
  'delete'
]
