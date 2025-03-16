import { Article } from "../../entities";
import { NotFoundError } from "../../errors";
import { IUseCase } from "../../interfaces";
import { IArticleDAO } from "../../interfaces/article";

export default class ViewArticle implements IUseCase<Article> {
  constructor (
    protected articleDAO: IArticleDAO
  ) {}

  async call(id: number, userID?: number): Promise<Article> {
    const article = await this.articleDAO.findOne(id)

    if (!article || (!article.isPublished && article.authorID !== userID && !!article.authorID)) {
      throw new NotFoundError('Article was not found')
    }
    return article
  }
}
