import express, { NextFunction, Request, Response, Router } from 'express'
import { services } from '../../../../config'
import { AuthController } from '../../../../controllers'
import { LoginUser, RegisterUser } from '../../../../use-cases/user'
const userDAO = new services.user.DAO()

const controller = new AuthController(
    new RegisterUser(services.user.validators.register, userDAO, services.utils.encryptPassword),
    new LoginUser(userDAO, services.utils.passwordsMatch, services.utils.issueToken)
)
const router: Router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstName, lastName, password } = req.body
    const result = await controller.register({ body: { email, firstName, lastName, password }})
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

export default router
