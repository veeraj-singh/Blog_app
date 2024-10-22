import { BlogCard } from '../components/blogcard' ;
import { Appbar } from '../components/appbar' ;
import { useBlogs } from '../custom_hooks' ;
import { useEffect, useState} from 'react';
import { jwtDecode } from 'jwt-decode' ;
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
    id: string;
    user: string
}

const TabButton = ({ children , isActive , onClick } : { children : any , isActive : any , onClick : any }) => (
  <button
    className={`px-6 py-3 font-medium rounded-t-lg transition duration-300 ${
      isActive
        ? 'bg-white text-purple-600 border-t-2 border-l-2 border-r-2 border-purple-200'
        : 'text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-gray-200'
    }`}
    onClick={onClick}>
    {children}
  </button>
);

export const Blogs = () => {
    const [user,setuser] = useState('')
    const [id,setid] = useState('')
    const { blogs , isloading} = useBlogs() ;
    const [activeTab, setActiveTab] = useState('recent');
    const navigate = useNavigate() ;

    useEffect(()=>{
        const token = localStorage.getItem('token') ;
        if(!token){
            navigate('/Signin')
        }
        const payload : DecodedToken = jwtDecode(token || '{}')
        setuser(payload.user)
        setid(payload.id)
    },[])

    if(isloading){
      return (<>
          <div className="w-full h-14 bg-gray-200 animate-pulse"></div>
          <div className="h-full w-full flex justify-center items-center">
              <div className="spinner-border animate-spin absolute top-0 left-0 right-0 bottom-0 m-auto h-12 w-12 border-4 border-b-purple-500 rounded-full"></div>
          </div>
      </>)
  }

    return (<>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Appbar authorname={user} authorId={id} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <TabButton isActive={activeTab === 'recent'} onClick={() => setActiveTab('recent')}>
              Recent
            </TabButton>
            <TabButton isActive={activeTab === 'trending'} onClick={() => setActiveTab('trending')}>
              Trending
            </TabButton>
            <TabButton isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>
              Favorites
            </TabButton>
          </div>
          
          <div className="p-8">
            {activeTab === 'recent' && (
              blogs && blogs.length > 0 ? (
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
                  <p className="text-2xl text-purple-800 mb-6">No posts available at the moment.</p>
                  <button className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 transform hover:scale-105">
                    Refresh
                  </button>
                </div>
              )
            )}
            
            {activeTab === 'trending' && (
              <div className="text-center py-16 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-2xl text-purple-800">Trending posts coming soon!</p>
              </div>
            )}
            
            {activeTab === 'favorites' && (
              <div className="text-center py-16 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-2xl text-purple-800">Your favorites will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>)
}

