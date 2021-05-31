import { PrismaClient } from '@prisma/client'
import { PermissionCreateInput } from 'generated'
import { operations } from './types/seeders.types'

const PermissionSeeder = (prisma: PrismaClient): PermissionCreateInput[] => {
  // Get models from Prisma metadata
  const prismaMeta = prisma as any
  const models: string[] = Object.values(prismaMeta._dmmf.modelMap).map((model: any) => model.name)

  // Generate permissions based on valid operations
  const permissions: PermissionCreateInput[] = operations
    .flatMap(operation => models
      .map(model => ({
        name: `${operation}${model}s`,
        description: `Permission required to ${operation} the ${model} model.`
      }))
    )

  return permissions
}

export default PermissionSeeder
