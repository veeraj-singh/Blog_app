import { useNavigate , useParams } from "react-router-dom" ;
import { useEffect , useState } from "react";
import { jwtDecode } from 'jwt-decode' ;
import { BlogCard } from "../components/blogcard";
import { useBlogs_user } from "../custom_hooks";
import { Appbar } from "../components/appbar";
import { PencilIcon } from 'lucide-react';

interface DecodedToken {
    id: string;
    user: string
}

export const Profile = () => {
    const params = useParams() ;
    const authorId = params.authorId || "";
    const { blogs , isloading } = useBlogs_user({authorId})
    const [user,setuser] = useState('') ;
    const navigate = useNavigate() ;
    
    useEffect(()=>{
        const payload : DecodedToken = jwtDecode(localStorage.getItem('token') || '{}')
        setuser(payload.user)
    },[])

    if(isloading){
        return (<>
            <div className="w-full h-14 bg-gray-200 animate-pulse"></div>
            <div className="h-full w-full flex justify-center items-center">
                <div className="spinner-border animate-spin absolute top-0 left-0 right-0 bottom-0 m-auto h-12 w-12 border-4 border-b-purple-500 rounded-full"></div>
            </div>
        </>)
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Appbar authorname={user} authorId={authorId} />
      <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 bg-gray-100 flex items-center justify-center p-8">
          <Avatar name={user} />
        </div>
        <div className="p-8 w-full">
          <div className="flex justify-between items-start">
            <div className="uppercase tracking-wide text-xl text-purple-600 font-bold mb-2">
              {user}
            </div>
            <button
              onClick={()=>{navigate(`/form/${authorId}`)}}
              className="flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Info
            </button>
          </div>
          <p className="text-gray-600 leading-relaxed">
            As a dedicated advocate for knowledge sharing, frequently writes about cutting-edge technologies, best practices, and programming languages.
          </p>
        </div>
      </div>
    </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Blog Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, ind) => (
            <div key={ind} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <BlogCard
                id={blog.id}
                authorname={blog.author.name}
                topic=''
                title={blog.title}
                likes={blog.likes}
                ed={1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}

function Avatar({name} : {name : string}){
    const initials = name.split(' ')
    return (
        <div className="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden ">
            <span className="text-6xl text-white">{initials[0][0]}{initials[1][0]}</span>
        </div>
    )
}

// import React from 'react';
// import { User, Calendar, ChevronRight } from 'lucide-react';

// const UserProfilePage = ({ user = {}, posts = [] }) => {
//   const { username = 'Anonymous', bio = 'No bio available', profilePicture } = user;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="md:flex">
//           <div className="md:flex-shrink-0">
//             {profilePicture ? (
//               <img
//                 className="h-48 w-full object-cover md:w-48"
//                 src={profilePicture}
//                 alt={`${username}'s profile`}
//               />
//             ) : (
//               <div className="h-48 w-full md:w-48 bg-gray-200 flex items-center justify-center">
//                 <User size={64} className="text-gray-400" />
//               </div>
//             )}
//           </div>
//           <div className="p-8">
//             <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
//               {username}
//             </div>
//             <p className="mt-2 text-gray-500">{bio}</p>
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold mt-12 mb-6">Blog Posts</h2>
      
//       {posts.length > 0 ? (
//         <div className="space-y-6">
//           {posts.map((post) => (
//             <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
//                 <p className="text-gray-600 mb-4">{post.description}</p>
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Calendar size={16} className="mr-2" />
//                   <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-6 py-4">
//                 <a href={`/posts/${post.id}`} className="flex items-center text-indigo-500 hover:text-indigo-600 font-medium">
//                   Read more
//                   <ChevronRight size={16} className="ml-1" />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 italic">No blog posts available.</p>
//       )}
//     </div>
//   );
// };

// export default UserProfilePage;