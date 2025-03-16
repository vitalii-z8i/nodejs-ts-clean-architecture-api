import express, { NextFunction, Request, Response, Router } from 'express'
import { services } from '../../../../config'
import { UserController } from '../../../../controllers'
import { UserProfile } from '../../../../use-cases/user'

const router = express.Router()
const controller = new UserController(
  new UserProfile(
    new services.user.DAO(),
    new services.article.DAO()
  )
)

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params?.id)
    const { page, perPage } = req.query as unknown as { page: number, perPage: number }
    const result = await controller.profile({ params: { id, page, perPage }})
    res.send(result)
  } catch (err) {
    next(err)
  }
})

export default router
