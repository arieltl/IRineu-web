import { Hono } from "hono";

const app = new Hono()

app.get('/remotes', (c) => {
    return c.render(
      <div>
        <h1>Hello remotes!</h1>
      </div>
    )
  })

export default app
