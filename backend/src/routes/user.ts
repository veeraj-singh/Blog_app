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
}) ;


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

}) ;

user.get('/:id', async (c) => {
    const prisma = c.get('prisma') ;
    try {
    const authorId = c.req.param('id');

    const user = await prisma.user.findUnique({
        where: {
        id: authorId,
        },
        select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
        degree: true,
        position: true,
        joined: true,
        twitter: true,
        linkedin: true,
        github: true,
        }
    });

    if (!user) {
        return c.json({
        success: false,
        message: 'Author not found'
        }, 404);
    }

    const authorData = {
        ...user,
        socialLinks: {
        twitter: user.twitter,
        linkedin: user.linkedin,
        github: user.github
        }
    };
    delete authorData.twitter;
    delete authorData.linkedin;
    delete authorData.github;

    return c.json(authorData, 200);

    } catch (error) {
    console.error('Error fetching author:', error);
    
    return c.json({
        success: false,
        message: 'Failed to fetch author information'
    }, 500);
    }
}
);

user.put('/:id', async (c) => {
    const prisma = c.get('prisma') ;
    const updateData = await c.req.json() ;
      try {
        const authorId = c.req.param('id');
        const updatedUser = await prisma.user.update({
          where: {
            id: authorId,
          },
          data: {
            name: updateData.name,
            email: updateData.email,
            bio: updateData.bio,
            profileImage: updateData.profileImage,
            degree: updateData.degree,
            position: updateData.position,
            twitter: updateData.socialLinks.twitter,
            linkedin: updateData.socialLinks.linkedin,
            github: updateData.socialLinks.github,
          },
        });
  
        const { password, ...userWithoutPassword } = updatedUser;
  
        return c.json({
          success: true,
          message: 'Author information updated successfully',
          data: userWithoutPassword
        }, 200);
      } catch (error : any) {
        if (error.code === 'P2002') {
          return c.json({
            success: false,
            message: 'Email already exists'
          }, 409);
        }
        console.error('Error updating author:', error);
        return c.json({
          success: false,
          message: 'Failed to update author information'
        }, 500);
      }
    }
  );
  

export default user