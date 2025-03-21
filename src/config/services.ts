import { MySQLArticleDAO, MySQLUserDAO } from '../infrastructure/data-access/mysql'
import {
  encryptPassword,
  issueToken,
  passwordsMatch,
  verifyToken,
} from '../infrastructure/utils/auth'
import * as validators from '../infrastructure/validation/joi'

export default {
  user: {
    validators: validators.user,
    DAO: MySQLUserDAO,
  },
  article: {
    validators: validators.article,
    DAO: MySQLArticleDAO,
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    passwordsMatch,
  },
}
