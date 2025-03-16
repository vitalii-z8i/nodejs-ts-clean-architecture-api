import { IPaginated, IRequest, IUseCase } from '../interfaces'
import { Article, User } from '../entities'

export default class ArticleController {
  constructor(
    protected authorizeUser: IUseCase<User>,
    protected fetchAuthorizedUser: IUseCase<User | null>,
    protected articleFeed: IUseCase<
      IPaginated<Pick<Article, 'id' | 'title' | 'description' | 'author'>>
    >,
    protected viewArticle: IUseCase<Article>,
    protected createArticle: IUseCase<Article>,
    protected updateArticle: IUseCase<Article>,
    protected deleteArticle: IUseCase<boolean>,
  ) {}

  async feed(
    request: IRequest,
  ): Promise<IPaginated<Pick<Article, 'id' | 'title' | 'description' | 'author'>>> {
    const page = parseInt(`${request.params?.page}`) || 1
    const perPage = parseInt(`${request.params?.perPage}`) || 10
    return this.articleFeed.call(page, perPage)
  }

  async view(request: IRequest): Promise<Article> {
    const { id } = request.params as { id: string | number }
    const user = await this.fetchAuthorizedUser.call(request?.token)
    return this.viewArticle.call(id, user?.id)
  }

  async create(request: IRequest): Promise<Article> {
    const user = await this.authorizeUser.call(request.token)
    return this.createArticle.call(user, request.body)
  }

  async update(request: IRequest): Promise<Article> {
    const user = await this.authorizeUser.call(request.token)
    const articleID = parseInt(request.params?.id as string)
    return this.updateArticle.call(articleID, user, request.body)
  }

  async delete(request: IRequest): Promise<boolean> {
    const user = await this.authorizeUser.call(request.token)
    const articleID = parseInt(request.params?.id as string)
    return this.deleteArticle.call(articleID, user)
  }
}
