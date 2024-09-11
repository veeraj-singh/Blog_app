import { BlogCard } from '../components/blogcard' ;
import { Appbar } from '../components/appbar' ;
import { useBlogs } from '../custom_hooks/Blogshook' ;
import { useEffect, useState} from 'react';
import { jwtDecode } from 'jwt-decode' ;

interface DecodedToken {
    id: string;
    user: string
}

export const Blogs = () => {
    const [user,setuser] = useState('')
    const { blogs , isloading} = useBlogs() ;

    useEffect(()=>{
        const payload : DecodedToken = jwtDecode(localStorage.getItem('token') || '{}')
        setuser(payload.user)
    },[])

    if(isloading){
        return (
            <>
            ...loading
            </>
        )
    }

    return (<>
    {/* console.log(user) */}
        <Appbar authorname={user}></Appbar>
        <div className="container mt-6 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {blogs.map((blog,ind)=>{
                    return <BlogCard
                    key={ind}
                    authorname={blog.author.name}
                    topic='Solana' 
                    title={blog.title}
                    />
                })}
            </div>
        </div>
        </>
    )
}
