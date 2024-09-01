import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'

export const blog = new Hono<{
    Bindings : {
        DATABASE_URL : string ,
        JWT_PASSWORD : string
    },
    Variables : {
        userId : string ,
        prisma : any
    }
}>()


// Middleware 
blog.use('/*', async (c,next) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    c.set('prisma',prisma)
    await next()
})

blog.use('/*', async (c,next) => {
    const jwt = c.req.header('Authorization')
    if(!jwt){
        c.status(401)
        return c.json({message : "Unauthorized"})
    }
    const token = jwt.split(' ')[1]
    const payload = await Jwt.verify(token,c.env.JWT_PASSWORD)

    if(!payload){
        c.status(401)
        return c.json({message : "Unauthorized"})
    }
    c.set<any>('userId', payload.id)
    await next()
})


// Blog-Handle routes
blog.get('/bulk', (c) => {
    const userId = c.get('userId')
    return c.text(userId)
})

blog.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.text(id)
})

blog.post('/', (c) => {
    return c.text('Hello Hono!')
})

blog.put('/', (c) => {
    return c.text('Hello Hono!')
})