import { Application, Request, Response } from 'express'
import { Token } from 'typedi'
import { Logger } from 'winston'

export interface Context {
  req: Request
  res: Response
}

export const ContainerTypes = {
  LOGGER: new Token<string>('LOGGER'),
  NOTFOUND: new Token<string>('NOT_FOUND')
}

export interface ILoader {
  logger: Logger
  start: () => Promise<Application> | Application | Promise<void>
}
