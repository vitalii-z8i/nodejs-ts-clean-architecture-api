import { RowDataPacket } from 'mysql2'
import { Article, User } from '../../../entities'
import { IUserDAO } from '../../../interfaces/user'
import client from './client'

export default class MySQLUserDAO implements IUserDAO {

  async findOneBy(filters: Partial<User>): Promise<User> {
    let query = 'SELECT * from `users`'
    const sqlFilters = Object.keys(filters).map(key => `${key} = ?`)
    if (sqlFilters.length > 0) {
      query = `${query} WHERE ${sqlFilters.join(' AND ')} LIMIT 1`
    }
    const [rows]: [RowDataPacket[], unknown] = await client.query(query, Object.values(filters))
    if (rows.length < 1) {
      throw new Error('User was not found')
    }

    return new User(rows[0] as unknown as User)
  }

  async create(payload: Partial<User>): Promise<User> {
    const dato = {
      id: 11,
      isPublished: false,
      title: 'string',
      description: 'string',
      content: 'string',
    }
    console.log(dato)
    console.log(new Article(dato))
    const fields = Object.keys(payload).join('`, `')
    const values = Object.values(payload)
    const query = `INSERT INTO \`users\` (\`${fields}\`) VALUES (${values.map(() => '?').join(', ')})`
    const [result] = await client.query(query, values)

    const [[data]]: [RowDataPacket[], unknown] = await client.query(`SELECT * FROM \`users\` WHERE \`id\` = ? LIMIT 1`, (result as { insertId: number }).insertId)

    if (!data.id) {
      throw new Error('Unable to create user')
    }
    const user = new User(data as unknown as User)
    return user
  }
}
