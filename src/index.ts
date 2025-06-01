import { Hono } from 'hono'
import remotePages from './remotes/remotes.pages'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Layout } from './layout'
import { serveStatic } from 'hono/bun'
import devicePages from './devices/devices.pages'
import learningPages from './learning/learning.pages'
import { HxRenderer } from './renderer'

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
export default app
