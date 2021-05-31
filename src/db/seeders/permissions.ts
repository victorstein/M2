import { PrismaClient } from '.prisma/client'
import { operations, PermissionSeed } from './types/seeders.types'

const PermissionSeeder = (): PermissionSeed[] => {
  // Get models from Prisma metadata
  const prisma = new PrismaClient()
  const prismaMeta = prisma as any
  const models: string[] = Object.values(prismaMeta._dmmf.modelMap).map((model: any) => model.name)

  // Generate permissions based on valid operations
  const permissions: PermissionSeed[] = operations
    .flatMap(operation => models
      .map(model => ({
        name: `${operation}${model}s`,
        description: `Permission required to ${operation} the ${model} model.`
      }))
    )

  return permissions
}

export default PermissionSeeder()
