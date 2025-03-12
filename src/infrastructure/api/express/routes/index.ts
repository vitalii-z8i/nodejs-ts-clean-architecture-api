import { Application } from 'express'
import auth from './auth'

export default {
  attach(app: Application): void {
    app.use('/auth', auth)
  },
}
