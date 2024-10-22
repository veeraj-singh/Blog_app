import { useState , useEffect } from "react"
import axios from "axios"
import { url } from "../BackendURL"

export interface BlogType {
    id : string ,
    title : string ,
    content : string ,
    topic  : string , 
    createdAt : string ,
    likes : number ,
    author : {
        name : string
    }
} ;

interface AuthorFormData {
    name: string;
    email: string;
    bio: string;
    socialLinks: {
        twitter: string;
        linkedin: string;
        github: string;
    };
    profileImage: string;
    degree: string;
    position: string;
    joined: string;
}

export const useBlog = ({id} : {id : string}) => {
    const [blog,setblog] = useState<BlogType>({
        id : '' ,
        title : '' ,
        content : '' ,
        topic : '' ,
        createdAt : '' ,
        likes : 0 ,
        author : {
            name : ''
        }
    })
    const [isloading,setisloading] = useState(true)

    useEffect(() => {
        axios.get(`${url}/api/v1/blog/${id}`,{
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            setblog(res.data)
            setisloading(false)
        })
    },[id])

    return { blog , isloading }
} ;

export const useBlogs = () => {
    const [blogs,setblogs] = useState<BlogType[]>([])
    const [isloading,setisloading] = useState(true)

    useEffect(() => {
        axios.get(`${url}/api/v1/blog/bulk`,{
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            setblogs(res.data)
            setisloading(false)
        })
    },[])

    return { blogs , isloading }
} ;

export const useBlogs_user = ({authorId} : {authorId : string}) => {
    const [blogs,setblogs] = useState<BlogType[]>([])
    const [isloading,setisloading] = useState(true)
    
    useEffect(() => {
        axios.get(`${url}/api/v1/blog/bulk/user/${authorId}`,{
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            setblogs(res.data)
            setisloading(false)
        })
    },[])

    return { blogs , isloading }
} ;

export const useBlogs_topic = ({topic} : {topic : string}) => {
    const [blogs,setblogs] = useState<BlogType[]>([])
    const [isloading,setisloading] = useState(true)
    
    useEffect(() => {
        axios.get(`${url}/api/v1/blog/bulk/topic/${topic}`,{
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            setblogs(res.data)
            setisloading(false)
        })
    },[])

    return { blogs , isloading }
} ;

export const useAuthorInfo = ({authorId} : {authorId : string}) => {
    const [formData, setFormData] = useState<AuthorFormData>({
        name: '',
        email: '',
        bio: '',
        socialLinks: {
            twitter: '',
            linkedin: '',
            github: ''
        },
        profileImage: '',
        degree: '',
        position: '',
        joined: new Date().toISOString().split('T')[0]
    })
    const [isloading,setisloading] = useState(true)
    
    useEffect(() => {
        axios.get(`${url}/api/v1/user/${authorId}`,{
            headers : {
                Authorization : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            setFormData(res.data)
            setisloading(false)
        })
    },[])
    return { formData, isloading }
} ;


