import express, { NextFunction, Request, Response, Router } from 'express'
import { services } from '../../../../config'
import { ArticleController } from '../../../../controllers'
import { AuthorizeUser, FetchAuthorisedUser } from '../../../../use-cases/user'
import {
  ArticleFeed,
  CreateArticle,
  DeleteArticle,
  UpdateArticle,
  ViewArticle,
} from '../../../../use-cases/article'

const articleDAO = new services.article.DAO()
const userDAO = new services.user.DAO()

const controller = new ArticleController(
  new AuthorizeUser(userDAO, services.utils.verifyToken),
  new FetchAuthorisedUser(userDAO, services.utils.verifyToken),
  new ArticleFeed(articleDAO),
  new ViewArticle(articleDAO),
  new CreateArticle(services.article.validators.createUpdate, articleDAO),
  new UpdateArticle(articleDAO),
  new DeleteArticle(articleDAO),
)
const router: Router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, perPage } = req.query as unknown as { page: number; perPage: number }
    const result = await controller.feed({ params: { page, perPage } })
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as { id: string }
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const result = await controller.view({ token, params: { id } })
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const { title, description, content, isPublished } = req.body
    const result = await controller.create({
      token,
      body: { title, description, content, isPublished },
    })
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as { id: string }
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const { title, description, content, isPublished } = req.body
    const result = await controller.update({
      token,
      params: { id },
      body: { title, description, content, isPublished },
    })
    res.send(result)
  } catch (err) {
    return next(err)
  }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as unknown as { id: string }
    const token = [...(req.headers['authorization']?.split(' ') || [])].pop() || ''
    const success = await controller.delete({ token, params: { id } })
    res.send({ success })
  } catch (err) {
    return next(err)
  }
})

export default router
