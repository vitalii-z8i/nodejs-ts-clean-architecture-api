import jwt from 'jsonwebtoken'

import { app } from '../../config'
import { User } from '../../entities'
import { UnauthorizedError } from '../../errors'

export default <T = User>(token: string): T => {
  try {
    return (jwt.verify(token, app.jwtSecret as string) as unknown) as T
  } catch (err) {
    throw new UnauthorizedError('Your token is invalid or expired')
  }
}
