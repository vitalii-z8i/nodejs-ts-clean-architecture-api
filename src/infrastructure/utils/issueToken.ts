import jwt from 'jsonwebtoken'

import { app } from '../../config'
import { User } from '../../entities'

export default (payload: Partial<User>, expiresIn?: string): string => {
  const jwtToken = jwt.sign(payload, app.jwtSecret as string, expiresIn ? { expiresIn: '2d' } : undefined)

  return jwtToken
}
