import { Article } from '../../entities'
import IPaginated from '../paginated'

export default interface IArticleDAO {
  userPublishedArticles(
    userID: number,
    page?: number,
    perPage?: number,
  ): Promise<Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]>
  userAllArticles(
    userID: number,
    page?: number,
    perPage?: number,
  ): Promise<Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]>
  listAsFeed(
    page: number,
    perPage: number,
  ): Promise<IPaginated<Pick<Article, 'id' | 'title' | 'description' | 'author'>>>
  findOne(id: number): Promise<Article | null>
  create(
    payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>,
  ): Promise<Article>
  update(
    id: number,
    payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>,
  ): Promise<Article>
  delete(id: number, userID?: number): Promise<boolean>
}
