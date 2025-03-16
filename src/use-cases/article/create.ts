import { Article, User } from '../../entities'
import { ValidationError } from '../../errors'
import { IUseCase, IValidator } from '../../interfaces'
import { IArticleDAO } from '../../interfaces/article'

export default class CreateArticle implements IUseCase<Article> {
  constructor(
    protected validator: IValidator<Article>,
    protected articleDAO: IArticleDAO,
  ) {}

  async call(
    user: User,
    payload: Pick<Article, 'title' | 'description' | 'content' | 'isPublished'>,
  ): Promise<Article> {
    const { data, errors } = this.validator.validate(payload)
    if (errors && errors.length > 0) {
      throw new ValidationError('The data is invalid', errors)
    }

    const article = new Article(data)
    Object.assign(article, {
      authorID: user.id,
      isPublished: data.isPublished || false,
    })

    return this.articleDAO.create(article)
  }
}
