import { useState , useEffect } from "react"
import axios from "axios"
import { url } from "../BackendURL"

interface BlogType {
    id : string ,
    title : string ,
    content : string ,
    author : {
        name : string
    }
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
}