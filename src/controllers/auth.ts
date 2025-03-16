import { IRequest, IUseCase } from '../interfaces'
import { Article, User } from '../entities'
import { ILoginResponse } from '../interfaces/user'

export default class AuthController {
  constructor(
    protected registerUser: IUseCase<User>,
    protected loginUser: IUseCase<ILoginResponse>,
    protected authorizeUser: IUseCase<User>,
    protected userArticles: IUseCase<
      Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]
    >,
    protected updateProfile: IUseCase<boolean>,
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

  async profile(request: IRequest): Promise<User> {
    const user = await this.authorizeUser.call(request.token, false)

    const page = parseInt(request.params?.page as string) || 1
    const perPage = parseInt(request.params?.perPage as string) || 10
    const articles = await this.userArticles.call(user.id, false, page, perPage)
    Object.assign(user, { articles })

    return user
  }

  async update(request: IRequest): Promise<boolean> {
    const user = await this.authorizeUser.call(request.token)

    return this.updateProfile.call(user.id, request.body)
  }
}
