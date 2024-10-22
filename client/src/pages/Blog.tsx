import { useBlog } from "../custom_hooks" ;
import { useParams } from "react-router-dom";
import { Appbar } from "../components/appbar";
import { BlogShow } from "../components/blogshow" ;
import { useEffect, useState} from 'react';
import { jwtDecode } from 'jwt-decode' ;

interface DecodedToken {
    id: string;
    user: string
}

export const Blog = () => {
    const params = useParams() ; 
    const id = params.id || "" ;
    const { blog , isloading } = useBlog({id})
    const [user,setuser] = useState('')
    const [authorid,setauthorid] = useState('')

    function formatDate(dateString : string) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const [year, month, day] = dateString.split(' ')[0].split('-');
        const dayInt = parseInt(day);
        const suffix = (dayInt === 1 || dayInt === 21 || dayInt === 31) ? 'st' : 
                       (dayInt === 2 || dayInt === 22) ? 'nd' : 
                       (dayInt === 3 || dayInt === 23) ? 'rd' : 'th';
        return `${dayInt}${suffix} ${months[+month - 1]} ${year}`;
    }

    useEffect(()=>{
        const payload : DecodedToken = jwtDecode(localStorage.getItem('token') || '{}')
        setuser(payload.user)
        setauthorid(payload.id)
    },[])

    if(isloading){
        return(<>
            <div className="w-full h-14 bg-gray-200 animate-pulse"></div>
            <div className="h-full w-full flex justify-center items-center">
                <div className="spinner-border animate-spin absolute top-0 left-0 right-0 bottom-0 m-auto h-12 w-12 border-4 border-b-purple-500 rounded-full"></div>
            </div>
        </>)
    }

    const jsoncotent = JSON.parse(blog.content) ;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Appbar authorname={user} authorId={authorid}></Appbar>
        <BlogShow 
            authorname={blog.author.name}
            time={formatDate(blog.createdAt)}
            title={blog.title}
            content={jsoncotent}
        />
    </div>)
}