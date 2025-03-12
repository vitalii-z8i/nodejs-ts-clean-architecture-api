import { Article } from '../../entities'
import IPaginated from '../paginated'

export default interface IArticleDAO {
  listAsFeed(page: number, perPage: number): Promise<IPaginated<Article>>
  findOne(id: number): Promise<Article | null>
  create(payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article>
  update(id: number, payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article>
  delete(id: number, userID?: number): Promise<boolean>
}
