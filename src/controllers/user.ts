import { IRequest, IUseCase } from '../interfaces'
import { User } from '../entities'

export default class UserController {
  constructor(
    protected authorizeUser: IUseCase<User>,
  ) {}

  async profile(request: IRequest): Promise<User> {
    const user = await this.authorizeUser.call(request.token)
    return user
  }
}
