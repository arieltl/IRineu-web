import { Hono } from 'hono'
import remotePages from './remotes/remotes.pages'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Layout } from './layout'
import { serveStatic } from 'hono/bun'

const app = new Hono()
app.use("/public/*", serveStatic({ root: "./" }))

app.use(
  jsxRenderer(({ children }) => {
    return Layout({ children })
  })
)
app.get('/', (c) => {
  return c.text('Hello Hono!')
})



app.route('/', remotePages)

export default app
