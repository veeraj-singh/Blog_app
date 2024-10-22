import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Appbar } from '../components/appbar';
import { BlogCard } from '../components/blogcard';
import { useBlogs_topic } from '../custom_hooks';
import { jwtDecode } from 'jwt-decode' ;

interface DecodedToken {
    id: string;
    user: string
}

export const TopicBlogPage = () => {
//   const [activeTab, setActiveTab] = useState('recent');
  const params = useParams();
  const topic = params.topic || "" ;
  const { blogs , isloading} = useBlogs_topic({topic}) ;
  const [user,setuser] = useState('')
  const [userId,setuserId] = useState('')
    
    useEffect(()=>{
        const payload : DecodedToken = jwtDecode(localStorage.getItem('token') || '{}')
        setuser(payload.user)
        setuserId(payload.id)
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
      <Appbar authorname={user} authorId={userId} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            {blogs && blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, ind) => (
                  <div key={ind} className="bg-white rounded-xl border border-purple-200 transition duration-300 hover:shadow-lg overflow-hidden transform hover:-translate-y-1">
                    <BlogCard
                      id={blog.id}
                      authorname={blog.author.name}
                      topic={blog.topic}
                      title={blog.title}
                      likes={blog.likes}
                      ed={0}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-xl text-purple-800 mb-2">No posts available for this topic at the moment.</p>
                <p className="text-base text-purple-600">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
