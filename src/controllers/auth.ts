import { IRequest, IUseCase } from '../interfaces'
import { User } from '../entities'
import { ILoginResponse } from '../interfaces/user'

export default class AuthController {
  constructor(
    protected registerUser: IUseCase<User>,
    protected loginUser: IUseCase<ILoginResponse>,
  ) {}

  async register(request: IRequest): Promise<{ success: boolean }> {
    const userPayload = request.body
    const user = await this.registerUser.call(userPayload)

    return { success: !!user.id }
  }

  async login(request: IRequest): Promise<ILoginResponse> {
    const { email, password } = request.body as { email: string; password: string }

    return this.loginUser.call(email, password)
  }
}
