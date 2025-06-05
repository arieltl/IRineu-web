import { Hono } from 'hono'
import remotePages from './remotes/remotes.pages'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Layout } from './layout'
import { serveStatic } from 'hono/bun'
import devicePages from './devices/devices.pages'
import learningPages from './learning/learning.pages'
import acPages from './ac/ac.pages'
import { HxRenderer } from './renderer'
// Import AC learning service to initialize MQTT listeners
import './ac/acLearning.service'

const app = new Hono()
app.use("/public/*", serveStatic({ root: "./" }))

app.use(
  jsxRenderer(({ children }, c) => {
    return Layout({ children, currentPath: c.req.path })
  })
)
app.use(HxRenderer)
app.get('/', (c) => {
  return c.redirect('/remotes')
})
app.route('/', remotePages)
app.route('/', devicePages)
app.route('/', learningPages)
app.route('/', acPages)
export default app
