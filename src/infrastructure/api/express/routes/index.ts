import { Application } from 'express'
import auth from './auth'
import articles from './articles'
import users from './users'
import admin from './admin'

export default {
  attach(app: Application): void {
    app.use('/auth', auth)
    app.use('/articles', articles)
    app.use('/users', users)
    app.use('/admin', admin)
  },
}
