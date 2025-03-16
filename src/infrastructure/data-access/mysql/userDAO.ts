import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { AuthUser, User } from '../../../entities'
import { IUserDAO } from '../../../interfaces/user'
import client from './client'
import { IPaginated } from '../../../interfaces'
import { ValidationError } from '../../../errors'

export default class MySQLUserDAO implements IUserDAO {

  async listUsers(filters: Partial<User>, page: number, perPage: number): Promise<IPaginated<User>> {
    let query = 'SELECT `id`, `firstName`, `lastName`, `email`, `role` FROM `users`'
    const sqlFilters = Object.keys(filters).map(key => `${key} = ?`)
    if (sqlFilters.length > 0) {
      query = `${query} WHERE ${sqlFilters.join(' AND ')}`
    }

    const [rows]: [RowDataPacket[], unknown] = await client.query(
      `${query} LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`,
      Object.values(filters)
    )

    return {
      data: rows.map(r => new User(r as User)),
      pagination: { page, perPage }
    }
  }


  async findOneBy(filters: Partial<User>): Promise<User | null> {
    let query = 'SELECT `id`, `firstName`, `lastName`, `email`, `role` FROM `users`'
    const sqlFilters = Object.keys(filters).map(key => `${key} = ?`)
    if (sqlFilters.length > 0) {
      query = `${query} WHERE ${sqlFilters.join(' AND ')} LIMIT 1`
    }
    const [rows]: [RowDataPacket[], unknown] = await client.query(query, Object.values(filters))
    if (rows.length < 1) {
      return null
    }

    return new User(rows[0] as unknown as User)
  }

  async findForAuth(email: string): Promise<AuthUser | null> {
    const [rows]: [RowDataPacket[], unknown] = await client.query(`SELECT * FROM \`users\` WHERE \`email\` = ? LIMIT 1`, email)
    if (rows.length < 1) {
      return null
    }

    return new AuthUser(rows[0] as unknown as AuthUser)
  }

  async create(payload: Partial<User>): Promise<User> {
    try {
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
    } catch (error) {
      const message = (error as Error).message
      if (message.includes('Duplicate entry') && message.includes('email')) {
        throw new ValidationError("The data is invalid", [{ field: 'email', message: 'This email is already taken' }])
      }
      throw error
    }
  }

  async update(id: number, payload: Partial<User>): Promise<boolean> {
    const updateFields = Object.keys(payload)
    if (updateFields.length === 0) {
      return false
    }
    const updateValues = Object.values(payload)
    const updateString = updateFields.map(field => `\`${field}\` = ?`).join(', ')

    const [{affectedRows}]: [ResultSetHeader, unknown] = await client.query(`UPDATE \`users\` SET ${updateString} WHERE \`id\` = ?`, [...updateValues, id])

    return affectedRows > 0
  }

  async delete(id: number): Promise<boolean> {
    const [result]: [ResultSetHeader, unknown] = await client.query(`DELETE FROM \`users\` WHERE \`id\` = ?`, id)
    return result.affectedRows > 0
  }
}
