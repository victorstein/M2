import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { Roles } from '../generated'
import PermissionSeeder from './seeders/permissions'
import RolesSeeder from './seeders/roles'
import PWGenerator from 'generate-password'
import argon from 'argon2'
import Logger from '../lib/logger'

const prisma = new PrismaClient()

// TODO: Define if the seeder needs the own permissions
// TODO: Create setup  file to assign permissions accordingly
// TODO: Create enum file dynamically to have all possible permissions

const seederFunction = async (): Promise<void> => {
  const permissions = PermissionSeeder(prisma)
  const roles = RolesSeeder

  Logger.info('Creating permissions... ⚙️')
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true
  })
  Logger.info('Permissions created successfully... ✅')

  Logger.info('Creating roles... ⚙️')
  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true
  })
  Logger.info('Roles created successfully... ✅')

  const adminRole = await prisma.role.findUnique({
    where: { name: Roles.ADMIN }
  })

  // Check if a user  with admin role exists
  const admin = await prisma.user.findFirst({
    where: { role: { name: { equals: 'ADMIN' } } }
  })

  if (admin == null) {
    if (adminRole == null) { throw new Error('Unable to seed database. Admin role does not exist.') }

    Logger.info('Creating admin user... ⚙️')
    const password = await argon.hash(PWGenerator.generate({ length: 20, numbers: true, symbols: true, strict: true }))
    await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL ?? '',
        firstName: 'Admin',
        lastName: 'Admin',
        password,
        role: { connect: { id: adminRole.id } },
        createdBy: {}
      }
    })
    Logger.info('Admin created successfully... ✅')
    return
  }

  Logger.warn('Admin user already exists ✅')
}

seederFunction()
  .catch((e) => {
    Logger.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
      .catch((e) => Logger.error(e.message))
  })
