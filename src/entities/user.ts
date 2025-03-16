import Article from './article'
import Entity from './entity'

export default class User extends Entity<User> {
  id!: number
  firstName!: string
  lastName!: string
  email!: string
  role!: 'user' | 'admin'

  articles?: Article[]
}
