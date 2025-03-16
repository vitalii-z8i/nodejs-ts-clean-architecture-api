import express, { NextFunction, Request, Response, Router } from 'express'
import { services } from '../../../../config'
import AdminController from '../../../../controllers/admin'
import { AuthorizeAdmin, DeleteUser, ListUsers, UpdateUser } from '../../../../use-cases/user'

const userDAO = new services.user.DAO()
const controller = new AdminController(
  new AuthorizeAdmin(userDAO, services.utils.verifyToken),
  new ListUsers(userDAO),
  new UpdateUser(services.user.validators.adminUpdate, userDAO, services.utils.encryptPassword),
  new DeleteUser(userDAO)
)

const router = express.Router()

router.use((req: Request, _res: Response, next: NextFunction) => {
  const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
  Object.assign(req, { token })
  next()
})

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req as unknown as { token: string }).token
    const { page, perPage } = req.query as unknown as { page: number, perPage: number }
    const result = await controller.users({ token, params: { page, perPage }})
    res.send(result)
  } catch (err) {
    next(err)
  }
})

router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req as unknown as { token: string }).token
    const id = parseInt(req.params.id)
    const body = req.body
    const success = await controller.usersUpdate({ token, body, params: { id }})
    res.send({ success })
  } catch (err) {
    next(err)
  }
})

router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req as unknown as { token: string }).token
    const id = parseInt(req.params.id)
    const success = await controller.usersDelete({ token, params: { id }})
    res.send({ success })
  } catch (err) {
    next(err)
  }
})

export default router
