import { IRequest, IUseCase } from '../interfaces'
import { User } from '../entities'

export default class UserController {
  constructor(
    protected userProfile:  IUseCase<User>,
  ) {}

  async profile(request: IRequest): Promise<User> {
    const { id } = request?.params as { id: number }
    const page = request.params?.page || 1
    const perPage = request.params?.perPage || 10
    const user = await this.userProfile.call(id, page, perPage)
    return user
  }
}
