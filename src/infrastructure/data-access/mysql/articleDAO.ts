import { OkPacket, OkPacketParams, QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2'
import { Article } from '../../../entities'
import { IPaginated } from '../../../interfaces'
import { IArticleDAO } from '../../../interfaces/article'
import client from './client'

export default class MySQLArticleDAO implements IArticleDAO {

  protected async userArticles(authorID: number, onlyPublished: boolean = true, page?: number, perPage?: number): Promise<Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]> {
    let query = 'SELECT `id`, `title`, `description` FROM `articles` WHERE `authorID` = ?'
    if (onlyPublished) {
      query = `${query} AND \`isPublished\` = true`
    }
    const pagination = (!!page && !!perPage) ? `LIMIT ${(perPage)} OFFSET ${(page - 1) * perPage}` : ''

    const [rows] = await client.query(`${query} ${pagination}`, authorID)
    return (rows as Article[]).map(r => new Article(r as unknown as Article))
  }

  async userPublishedArticles(authorID: number, page?: number, perPage?: number): Promise<Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]> {
    return this.userArticles(authorID, true, page, perPage)
  }

  async userAllArticles(authorID: number, page?: number, perPage?: number): Promise<Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]> {
    return this.userArticles(authorID, false, page, perPage)
  }

  async listAsFeed(page: number, perPage: number): Promise<IPaginated<Pick<Article, 'id' | 'title' | 'description' | 'author'>>> {
    let query = `SELECT \`articles\`.\`id\`, \`articles\`.\`title\`, \`articles\`.\`description\`,
                        \`users\`.\`id\` AS \`author.id\`,
                        \`users\`.\`firstName\` AS \`author.firstName\`,
                        \`users\`.\`lastName\` AS \`author.lastName\`
                 FROM \`articles\`
                 LEFT JOIN \`users\` ON (\`users\`.\`id\` = \`articles\`.\`authorID\`)
                 WHERE \`articles\`.\`isPublished\` = true
                 ORDER BY \`articles\`.\`id\` DESC
                 LIMIT ? OFFSET ?`

    const [rows] = await client.query(query, [perPage, (page - 1) * perPage])
    return {
      data: (rows as Partial<Article>[]).map(this.normalizeArticle),
      pagination: { page, perPage },
    }
  }

  async findOne(id: number): Promise<Article | null> {
    const [rows]: [RowDataPacket[], unknown] = await client.query(`
        SELECT \`articles\`.*,
               \`users\`.\`id\` AS \`author.id\`,
               \`users\`.\`firstName\` AS \`author.firstName\`,
               \`users\`.\`lastName\` AS \`author.lastName\`
        FROM \`articles\`
        LEFT JOIN \`users\` ON (\`users\`.\`id\` = \`articles\`.\`authorID\`)
        WHERE \`articles\`.\`id\` = ?
        LIMIT 1`, id)

    if (!rows || !rows[0]) {
      return null
    }
    return this.normalizeArticle(rows[0])
  }

  async create(payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article> {
    const fields = Object.keys(payload).join('`, `')
    const values = Object.values(payload)
    const query = `INSERT INTO \`articles\` (\`${fields}\`) VALUES (${values.map(() => '?').join(', ')})`
    const [{ insertId }]: [ResultSetHeader, unknown] = await client.query(query, values)
    const [rows]: [RowDataPacket[], unknown] = await client.query(`SELECT * FROM \`articles\` WHERE \`id\` = ? LIMIT 1`, insertId)
    if (!rows || !rows[0]) {
      throw new Error('Unable to create article')
    }
    return new Article(rows[0] as unknown as Article)
  }

  async update(id: number, payload: Pick<Article, 'title' | 'description' | 'content' | 'author' | 'isPublished'>): Promise<Article> {
    const fields = Object.keys(payload).map(f => `\`${f}\` = ?`).join(', ')
    const values = [...Object.values(payload), id]
    let query = `UPDATE \`articles\` SET ${fields} WHERE \`id\` = ?`

    await client.query(query, values)

    return this.findOne(id) as Promise<Article>
  }

  async delete(id: number, userID?: number): Promise<boolean> {
    const queryValues = [id]
    if (!!userID) { queryValues.push(userID) }
    const [result]: [ResultSetHeader, unknown] = await client.query(`DELETE FROM \`articles\` WHERE \`id\` = ? ${!!userID ? 'AND `authorID` = ?' : ''}`, queryValues)

    return result.affectedRows > 0
  }

  private normalizeArticle(article: Partial<Article> & Record<string, unknown>): Article {
    if (!!article['author.id']) {
      Object.assign(article, {
        author: {
          id: article['author.id'],
          firstName: article['author.firstName'],
          lastName: article['author.lastName'],
        }
      })

      delete article['author.id'],
      delete article['author.firstName']
      delete article['author.lastName']
    }
    return new Article(article)
  }
}
