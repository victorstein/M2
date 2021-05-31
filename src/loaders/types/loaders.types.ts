import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { Token } from 'typedi'

export interface ILoader {
  start: () => Promise<void> | void
}

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
}

export const CONTAINER = {
  LOGGER: new Token<string>('logger')
}
