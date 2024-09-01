import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import user from './routes/user'
import blog from './routes/blog'

const app = new Hono<{
    Bindings : {
        DATABASE_URL : string ,
        JWT_PASSWORD : string
    }
}>()

// POST /api/v1/user/signup
// POST /api/v1/user/signin
// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id
// GET /api/v1/blog/bulk

app.route('api/v1/user',user) ;
app.route('api/v1/blog',blog) ;

export default app
