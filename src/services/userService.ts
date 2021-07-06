import argon2 from 'argon2'
import generator from 'generate-password'
import { injectable } from 'inversify'

@injectable()
export class UserService {
  generateTemporaryPassword (): string {
    return generator.generate({
      length: 15,
      numbers: true,
      strict: true
    })
  }

  async hashPassword (password: string): Promise<String> {
    return await argon2.hash(password, { type: argon2.argon2i })
  }
}
