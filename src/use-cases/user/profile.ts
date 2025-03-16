import { User } from "../../entities";
import { NotFoundError } from "../../errors";
import { IUseCase } from "../../interfaces";
import { IArticleDAO } from "../../interfaces/article";
import { IUserDAO } from "../../interfaces/user";

export default class UserProfile implements IUseCase<User> {
  constructor(protected userDAO: IUserDAO, protected articleDAO: IArticleDAO) {}

  async call(id: number, articlesPage?: number, articlesPerPage?: number): Promise<User> {
    const user = await this.userDAO.findOneBy({ id })

    if (!user) {
      throw new NotFoundError('User was not found')
    }

    const articles = await this.articleDAO.userPublishedArticles(user.id, articlesPage, articlesPerPage)
    Object.assign(user, { articles })

    return user
  }
}
