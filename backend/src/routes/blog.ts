import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from 'hono/utils/jwt'
import { CreatePostInput , UpdatePostInput } from '@veerajsingh/common'


const blog = new Hono<{
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
blog.use('*', async (c,next) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    c.set('prisma',prisma)
    await next()
})

blog.use('*', async (c,next) => {
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
blog.get('/bulk', async (c) => {
    const prisma = c.get('prisma')
    const posts = await prisma.post.findMany({
        select : {
            id : true ,
            title : true ,
            content : true ,
            author : {
                select : {
                    name : true 
                }
            }
        }
    });
	return c.json(posts);
})

blog.get('/:id', async (c) => {
    const id = c.req.param('id')
    const prisma = c.get('prisma')
    const post = await prisma.post.findUnique({
		where: {
			id
		}
	});
	return c.json(post);
})

blog.post('', async (c) => {
    const body = await c.req.json()
    const { success } = CreatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    const prisma = c.get('prisma')
    const post = await prisma.post.create({
        data : {
            title : body.title ,
            content : body.content ,
            authorId : c.get('userId')
        }
    })
    return c.json({id : post.id})
})

blog.put('', async (c) => {
    const body = await c.req.json()
    const { success } = UpdatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    const userId = c.get('userId')
    const prisma = c.get('prisma')
    const post = await prisma.post.update({
        where : {
            id : body.id ,
            authorId : userId
        },
        data : {
            title : body.title ,
            content : body.content
        }
    })

    return c.text(`${post.title} Post Updated`)
})

export default blog