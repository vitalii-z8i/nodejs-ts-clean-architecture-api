import { Article, User } from '../../entities'
import { NotFoundError, UnauthorizedError } from '../../errors'
import { IUseCase } from '../../interfaces'
import { IArticleDAO } from '../../interfaces/article'

export default class UpdateArticle implements IUseCase<Article> {
  constructor(protected articleDAO: IArticleDAO) {}

  async call(
    id: number,
    user: Pick<User, 'id' | 'role'>,
    payload: Pick<Article, 'title' | 'content' | 'description' | 'isPublished'>,
  ): Promise<Article> {
    const article = await this.articleDAO.findOne(id)

    if (!article) {
      throw new NotFoundError('Article not found')
    }

    if (article.authorID !== user.id && user.role !== 'admin') {
      throw new UnauthorizedError('You are not allowed to update this article')
    }

    return this.articleDAO.update(id, payload)
  }
}
