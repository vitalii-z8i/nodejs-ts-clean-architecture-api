import { User } from '../../entities'
import { IUserDAO } from '../../interfaces/user'
import { IUseCase } from '../../interfaces'
import { UnauthorizedError } from '../../errors'

export default class AuthorizeAdmin implements IUseCase<User> {
  constructor(
    protected userDAO: IUserDAO,
    protected verifyToken: (token: string) => User,
  ) {}

  async call(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedError('You`re not authorized')
    }
    const { id } = this.verifyToken(token)
    const user = await this.userDAO.findOneBy({ id, role: 'admin' })
    if (!user) {
      throw new UnauthorizedError('You`re not authorized')
    }
    return user
  }
}
