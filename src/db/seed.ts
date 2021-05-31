import { PrismaClient } from '.prisma/client'
import PermissionSeeder from './seeders/permissions'
import RolesSeeder from './seeders/roles'

const prisma = new PrismaClient()

// TODO: Define if the seeder needs the own permissions
// TODO: Create setup  file to assign permissions accordingly
// TODO: Create enum file dynamically to have all possible permissions

const seederFunction = async (): Promise<void> => {
  const permissions = PermissionSeeder
  const roles = RolesSeeder

  console.log('Creating permissions... ⚙️')
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true
  })
  console.log('Permissions created successfully... ✅')

  console.log('Creating roles... ⚙️')
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true
  })
  console.log('Roles created successfully... ✅')
}

seederFunction()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
      .catch((e) => console.log(e))
  })
