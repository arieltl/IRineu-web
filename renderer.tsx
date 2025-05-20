import { createMiddleware } from 'hono/factory';
export const HxRenderer = createMiddleware(async (ctx, next) => {
    if (ctx.req.header('HX-Request') === 'true') {
        ctx.setRenderer((content)=>{
            return ctx.html(content );
            
        })
    }
    await next();
});