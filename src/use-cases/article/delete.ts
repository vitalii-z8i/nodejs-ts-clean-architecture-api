import { User } from '../../entities'
import { IUseCase } from '../../interfaces'
import { IArticleDAO } from '../../interfaces/article'

export default class DeleteArticle implements IUseCase<boolean> {
  constructor(protected articleDAO: IArticleDAO) {}

  async call(id: number, user: Pick<User, 'id' | 'role'>): Promise<boolean> {
    if (user.role === 'admin') {
      return this.articleDAO.delete(id)
    }

    return this.articleDAO.delete(id, user.id)
  }
}
