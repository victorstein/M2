import { PrismaClient } from '@prisma/client'
import { Roles } from 'generated'
import PermissionSeeder from './seeders/permissions'
import RolesSeeder from './seeders/roles'

const prisma = new PrismaClient()

// TODO: Define if the seeder needs the own permissions
// TODO: Create setup  file to assign permissions accordingly
// TODO: Create enum file dynamically to have all possible permissions

const seederFunction = async (): Promise<void> => {
  const permissions = PermissionSeeder(prisma)
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

  const adminRole = await prisma.role.findUnique({
    where: { name: Roles.ADMIN }
  })

  if (adminRole == null) { throw new Error('Unable to seed database. Admin role does not exist.') }

  console.log('Creating admin user... ⚙️')
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL ?? '',
      firstName: 'Admin',
      lastName: 'Admin',
      password: '',
      role: { connect: { id: adminRole.id } },
      createdBy: {}
    }
  })
  console.log('Admin created successfully... ✅')
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
