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
            topic : true ,
            likes : true ,
            author : {
                select : {
                    name : true 
                }
            }
        }
    });
	return c.json(posts);
})

blog.get('/bulk/user/:authorId', async (c) => {
    const prisma = c.get('prisma')
    const authorId = c.req.param('authorId')
    const posts = await prisma.post.findMany({
        where: {
            authorId: authorId,
        },
        select : {
            id : true ,
            title : true ,
            content : true ,
            likes : true ,
            author : {
                select : {
                    name : true 
                }
            }
        }
    })
    return c.json(posts);
})

blog.get('/bulk/topic/:topic', async (c) => {
    const prisma = c.get('prisma')
    const topic = c.req.param('topic')
    const posts = await prisma.post.findMany({
        where: {
            topic: topic,
        },
        select : {
            id : true ,
            title : true ,
            content : true ,
            likes : true ,
            author : {
                select : {
                    name : true 
                }
            }
        }
    })
    return c.json(posts);
})

blog.get('/search', async (c) => {

    const prisma = c.get('prisma')
    const field = c.req.query('field')
    const term = c.req.query('term')
    const isSuggestion = c.req.query('suggestion') === 'true'
  
    if (!field || !term) {
      return c.json({ error: 'Missing field or term parameter' }, 400)
    }
  
    try {
      let results = []
      const take = isSuggestion ? 5 : 50 
  
      switch (field) {
        case 'author':
          results = await prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: term, mode: 'insensitive' } },
                { email: { contains: term, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              name: true,
              email: true,
              ...(isSuggestion ? {} : {
                posts: {
                  select: {
                    id: true,
                    title: true,
                    content: true,
                    topic: true,
                    createdAt: true
                  }
                }
              })
            },
            take
          })
          break
        case 'topic':
          if (isSuggestion) {
            results = await prisma.post.findMany({
              where: { topic: { contains: term, mode: 'insensitive' } },
              select: { topic: true },
              distinct: ['topic'],
              take
            })
            results = results.map((r : any)=> ({ suggestion: r.topic}))
          } else {
            results = await prisma.post.findMany({
              where: { topic: { contains: term, mode: 'insensitive' } },
              include: {
                author: {
                  select: { id: true, name: true, email: true }
                }
              },
              take
            })
          }
          break
        case 'title':
          if (isSuggestion) {
            results = await prisma.post.findMany({
              where: { title: { contains: term, mode: 'insensitive' } },
              select: { id : true , title: true },
              take
            })
            results = results.map((r : any) => ({ suggestion: r.title , id:r.id}))
          } else {
            results = await prisma.post.findMany({
              where: { title: { contains: term, mode: 'insensitive' } },
              include: {
                author: {
                  select: { id: true, name: true, email: true }
                }
              },
              take
            })
          }
          break
        default:
          return c.json({ error: 'Invalid search field' }, 400)
      }

      return c.json(results)
    } catch (error) {
      console.error('Error performing search:', error)
      return c.json({ error: 'An error occurred while performing the search' }, 500)
    }
  })


blog.get('/:id', async (c) => {
    const id = c.req.param('id')
    const prisma = c.get('prisma')
    const post = await prisma.post.findUnique({
		where: {
			id
		} ,
        select : {
            id : true ,
            title : true ,
            content : true ,
            topic : true ,
            createdAt : true ,
            author : {
                select : {
                    name : true 
                }
            }
        }
	});
    
	return c.json(post);
}) ;

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
            topic : body.topic ,
            content : body.content ,
            authorId : c.get('userId')
        }
    })
    return c.json({id : post.id})
})

blog.put('/:id', async (c) => {
    const id = c.req.param('id')
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
            id : id ,
            authorId : userId
        },
        data : {
            title : body.title ,
            topic : body.topic ,
            content : body.content ,
        }
    })

    return c.json({id : post.id}) ;
})

blog.delete('',async (c) => {
    const body = await c.req.json()
    const userId = c.get('userId')
    const prisma = c.get('prisma')
    await prisma.post.delete({
        where : {
            id : body.id ,
            authorId : userId
        }
    })
    c.status(200)
    return c.text(`Post Deleted`)
})

blog.post('/:id/like', async (c) => {
    const prisma = c.get('prisma')
    try {
      const id = c.req.param('id') ;
      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          likes: {
            increment: 1
          }
        },
        select: { likes: true }
      });
  
      return c.json({ likes: updatedPost.likes });
    } catch (error) {
      console.error('Error updating like:', error);
        c.status(500)
        c.json({ error: 'Internal server error' });
    }
  });

export default blog