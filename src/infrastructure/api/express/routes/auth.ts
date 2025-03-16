import express, { NextFunction, Request, Response, Router } from 'express'
import { services } from '../../../../config'
import { AuthController } from '../../../../controllers'
import { AuthorizeUser, LoginUser, RegisterUser, UpdateUser } from '../../../../use-cases/user'
import { UserArticlesList } from '../../../../use-cases/article'

const userDAO = new services.user.DAO()
const articleDAO = new services.article.DAO()

const controller = new AuthController(
    new RegisterUser(services.user.validators.register, userDAO, services.utils.encryptPassword),
    new LoginUser(userDAO, services.utils.passwordsMatch, services.utils.issueToken),
    new AuthorizeUser(userDAO, services.utils.verifyToken),
    new UserArticlesList(articleDAO),
    new UpdateUser(services.user.validators.update, userDAO, services.utils.encryptPassword)
)
const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, password, confirmPassword } = req.body
    const result = await controller.register({ body: { email, firstName, lastName, password, confirmPassword }})
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await controller.login({ body: { email, password }})
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, perPage } = req.query as unknown as { page: number, perPage: number }
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const result = await controller.profile({ token, params: { page, perPage }})
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const { email, password, firstName, lastName, confirmPassword } = req.body
    const success = await controller.update({ token, body: { email, password, firstName, lastName, confirmPassword }})
    res.send({ success })
  } catch (err) {
    return next(err)
  }
})

export default router
