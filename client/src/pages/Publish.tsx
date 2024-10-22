import { Appbar } from '../components/appbar' ;
import { useEffect, useState} from 'react';
import { jwtDecode } from 'jwt-decode' ;
import TextEditor  from '../components/quilleditor' ;
import { useParams } from 'react-router-dom';

interface DecodedToken {
    id: string;
    user: string
} ;

export const Publish = () => {
    const [user,setuser] = useState('') ;
    const [userid,setuserid] = useState('') ;
    let { id } = useParams();

    useEffect(()=>{
        const payload : DecodedToken = jwtDecode(localStorage.getItem('token') || '{}')
        setuser(payload.user)
        setuserid(payload.id)
    },[])

    if(!user){
        return (
            <div className="w-full h-10 bg-gray-300 animate-pulse"></div>
        )
    }
  
    return (<>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            <Appbar authorname={user} authorId={userid}></Appbar>
            <div className="flex justify-center w-full pt-8"> 
                <div className="max-w-screen-lg w-full">
                    <TextEditor id={id}/> 
                </div>
            </div>
        </div>
    </>)
} ;

// function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
//     return <div className="mt-2">
//         <div className="w-full mb-4 ">
//             <div className="flex items-center justify-between border">
//             <div className="my-2 bg-gray-50 rounded-b-lg w-full">
//                 <label className="sr-only">Publish post</label>
//                 <textarea onChange={onChange} id="editor" rows={16} className="focus:outline-none block w-full h-96 px-0 text-sm text-gray-800 bg-gray-50 border-0 pl-2" placeholder="Write an article..." required />
//             </div>
//         </div>
//        </div>
//     </div>  
// }

