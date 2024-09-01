import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'

const user = new Hono<{
    Bindings : {
        DATABASE_URL : string ,
        JWT_PASSWORD : string
    },
    Variables : {
        prisma : any
    }
}>()

// Middleware
user.use('*', async (c,next) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    c.set('prisma',prisma)
    await next()
})


// User-Handle routes
user.post('/signup', async (c) => {

    const body = await c.req.json() ;
    try{
        const res = await c.get('prisma').user.create({
        data : {
            email : body.email ,
            password : body.password
        }
        })
        const token = await Jwt.sign({id : res.id},c.env.JWT_PASSWORD)
        return c.json({token})
    }catch(err){
        c.status(403) ;
        return c.json({message : "error while signing up"})
    }

})


user.post('/signin', async (c) => {

    const body = await c.req.json() ;
    const res = await c.get('prisma').user.findUnique({
        where : {
        email : body.email
        }
    })
    if(!res){
        c.status(403)
        return c.json({message : "SignUp first"})
    }
    const token = await Jwt.sign({id : res.id},c.env.JWT_PASSWORD)
    return c.json({token})

})

export default user