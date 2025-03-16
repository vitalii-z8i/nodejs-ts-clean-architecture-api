import { User } from '../../entities'
import { IUseCase } from '../../interfaces'
import { IUserDAO } from '../../interfaces/user'

export default class FetchAuthorisedUser implements IUseCase<User | null> {
  constructor(
    protected userDAO: IUserDAO,
    protected verifyToken: (token: string) => User,
  ) {}

  async call(token: string): Promise<User | null> {
    if (!token) {
      return null
    }
    try {
      const { id } = this.verifyToken(token)
      const user = await this.userDAO.findOneBy({ id })
      return user
    } catch {
      return null
    }
  }
}
