import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'
import { SignUpInput , SignInInput } from '@veerajsingh/common'

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
    const { success } = SignUpInput.safeParse(body);
    console.log(body)
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

    try{
        const res = await c.get('prisma').user.create({
        data : {
            email : body.email ,
            password : body.password ,
            name : body.name
        }
        })
        
        const token = await Jwt.sign({id : res.id , user : res.name},c.env.JWT_PASSWORD)
        return c.json({token})
    }catch(err){
        c.status(403) ;
        return c.json({message : "error while signing up"})
    }

})


user.post('/signin', async (c) => {

    const body = await c.req.json() ;
    const { success } = SignInInput.safeParse(body);
    console.log(success)
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    const res = await c.get('prisma').user.findUnique({
        where : {
        email : body.email
        }
    })
    if(!res){
        c.status(403)
        return c.json({message : "SignUp first"})
    }
    const token = await Jwt.sign({id : res.id , user : res.name},c.env.JWT_PASSWORD)
    return c.json({token})

})

export default user