import { Article } from '../../entities'
import { IPaginated, IUseCase } from '../../interfaces'
import { IArticleDAO } from '../../interfaces/article'

export default class ArticleFeed implements IUseCase<IPaginated<Article>> {
  constructor (
    protected articleDAO: IArticleDAO,
  ) {}

  async call(page: number, perPage: number): Promise<IPaginated<Article>> {
    if (!page || !perPage) {
      throw new Error('Please set pagination params')
    }
    return this.articleDAO.listAsFeed(page, perPage)
  }
}
