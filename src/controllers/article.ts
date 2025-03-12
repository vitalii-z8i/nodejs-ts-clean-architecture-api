import { IPaginated, IRequest, IUseCase } from '../interfaces'
import { Article, User } from '../entities'

export default class ArticleController {
  constructor(
    protected authorizeUser: IUseCase<User>,
    protected articleFeed: IUseCase<IPaginated<Article>>,
    protected createArticle: IUseCase<Article>,
    protected updateArticle: IUseCase<Article>,
    protected deleteArticle: IUseCase<boolean>,
  ) {}

  async feed(request: IRequest): Promise<IPaginated<Article>> {
    const page = parseInt(`${request.params?.page}`) || 1
    const perPage = parseInt(`${request.params?.perPage}`) || 10
    return this.articleFeed.call(page, perPage)
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
