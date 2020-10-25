import { server } from './server'

describe('Server', () => {
  it('Should not throw errors when initializing', async () => {
    await expect(server.start()).resolves.toBeUndefined()
  })
})