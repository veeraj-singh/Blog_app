import { Hono } from 'hono'
import { user } from './routes/user'
import { blog } from './routes/blog'

const app = new Hono()

// POST /api/v1/user/signup
// POST /api/v1/user/signin
// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id
// GET /api/v1/blog/bulk

app.route('api/v1/user',user) ;
app.route('api/v1/blog',blog) ;

export default app
