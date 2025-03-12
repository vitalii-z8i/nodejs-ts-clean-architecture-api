import { MySQLArticleDAO, MySQLUserDAO } from "../infrastructure/data-access/mysql";
import { encryptPassword, issueToken, passwordsMatch, verifyToken } from "../infrastructure/utils";
import * as validators from "../infrastructure/validators/joi"

export default {
    user: {
        validators: validators.user,
        DAO: MySQLUserDAO,
    },
    article: {
        validators: {},
        DAO: MySQLArticleDAO,
    },
    utils: {
        encryptPassword,
        issueToken,
        verifyToken,
        passwordsMatch,
    }
}
