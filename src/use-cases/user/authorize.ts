import { User } from '../../entities'
import { IUserDAO } from '../../interfaces/user'
import { IUseCase } from '../../interfaces'

export default class AuthorizeUser implements IUseCase<User> {
  constructor(
		protected userDAO: IUserDAO,
		protected verifyToken: (token: string) => User
	) {}

  async call(token: string): Promise<User> {
    if (!token) {
      throw new Error('You`re not authorized')
    }
    const { id } = this.verifyToken(token)
    const user = await this.userDAO.findOneBy({ id })
    if (!user) {
      throw new Error('You`re not authorized')
    }
    return user
  }
}
