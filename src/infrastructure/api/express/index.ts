import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import methodOverride from 'method-override'
import routes from './routes'
import { IError } from '../../../interfaces'

const app: express.Application = express()

app.use(logger('dev'))
app.use(express.json())
app.use(
  cors({
    origin: '*', // Please don't do this in real-world apps
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }),
)
app.use(express.urlencoded({ extended: false }))

app.get('/', async (_req: express.Request, res: express.Response) => {
  res.send({ name: 'Articles API' })
})

routes.attach(app)

app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).send({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.baseUrl}`,
  })
})

app.use(methodOverride())
app.use((err: IError, _req: express.Request, res: express.Response) => {
  console.error(err)
  res.status(err.httpStatus || 500).send({
    error: err.name,
    message: err.message,
    details: err?.details,
  })
})

export default app
