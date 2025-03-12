import { Article, User } from '../../entities'
import { IUseCase, IValidator } from '../../interfaces'
import { IArticleDAO } from '../../interfaces/article'

export default class CreateArticle implements IUseCase<Article> {
  constructor (
    protected validator: IValidator<Article>,
    protected articleDAO: IArticleDAO,
  ) {}

  async call(user: User, payload: Pick<Article, 'title' | 'description' | 'content' | 'isPublished'>): Promise<Article> {
    const { data, errors } = this.validator.validate(payload)
    if (errors && errors[0]) {
      throw new Error(`${errors[0].field} is invalid: ${errors[0].message}`)
    }

    const article = new Article(data)
    Object.assign(article, {
      authorID: user.id,
    })

    return this.articleDAO.create(article)
  }
}
