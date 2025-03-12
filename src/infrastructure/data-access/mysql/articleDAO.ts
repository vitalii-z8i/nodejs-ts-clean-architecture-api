import { Article } from '../../../entities'
import { NotFoundError } from '../../../errors'
import { IPaginated } from '../../../interfaces'
import { IArticleDAO } from '../../../interfaces/article'
import client from './client'

export default class MySQLArticleDAO implements IArticleDAO {
  async listAsFeed(page: number, perPage: number): Promise<IPaginated<Article>> {
    let query = 'SELECT * FROM `articles` LIMIT ? OFFSET ?'
    const rows = await client.query(query, [perPage, (page - 1) * perPage])
    return {
      data: rows.map(r => new Article(r as unknown as Article)),
      pagination: { page, perPage },
    }
  }

  async findOne(id: number): Promise<Article | null> {
    const [article] = await client.query('SELECT * FROM `articles` WHERE `id` = ? LIMIT 1', [id])
    if (!article) {
      throw new NotFoundError('Article not found')
    }
    return new Article(article as unknown as Article)
  }

  async create(payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article> {
    const fields = Object.keys(payload).join('`, `')
    const values = Object.values(payload)
    const query = `INSERT INTO \`articles\` (\`${fields}\`) VALUES (${values.map(() => '?').join(', ')})`
    const [id] = await client.query(query, values)
    const [article] = await client.query(`SELECT * FROM \`articles\` WHERE \`id\` = ? LIMIT 1`, id)
    if (!article) {
      throw new Error('Unable to create article')
    }
    return new Article(article as unknown as Article)
  }

  async update(id: number, payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article> {
    throw Error('Method not implemented')
  }

  async delete(id: number, userID?: number): Promise<boolean> {
    throw Error('Method not implemented')
  }
}
