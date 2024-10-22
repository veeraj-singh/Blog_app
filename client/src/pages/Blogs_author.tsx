import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Appbar } from '../components/appbar';
import { BlogCard } from '../components/blogcard';
import { useBlogs_user } from '../custom_hooks';
import { jwtDecode } from 'jwt-decode' ;

interface DecodedToken {
    id: string;
    user: string
}

export const AuthorBlogPage = () => {
  // const [activeTab, setActiveTab] = useState('recent');
  const params = useParams() ;
  const authorId = params.authorId || "";
  const { blogs , isloading} = useBlogs_user({authorId}) ;
  const [user,setuser] = useState('')
    
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
      <main className="container mx-auto px-4 py-12">
        {authorId && (
          <div className="max-w-7xl mx-auto mb-8 bg-white rounded-2xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
            <div className="p-8 flex items-center space-x-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{blogs[0]?.author.name}</h1>
                <p className="text-gray-600 mt-2 leading-relaxed">{blogs[0] && "As a dedicated advocate for knowledge sharing, frequently writes about cutting-edge technologies, best practices, and programming languages."}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {blogs && blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="text-center py-16 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-2xl text-purple-800 mb-2">No posts available from this author at the moment.</p>
                <p className="text-lg text-purple-600">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};