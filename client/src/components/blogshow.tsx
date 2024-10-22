import { BlogPost } from "./render" ;
import { ContentItem } from './render';

interface BlogshowType {
    authorname : string ,
    time : string ,
    title : string ,
    content : ContentItem[]
} ;

export const BlogShow = ({
    authorname ,
    time ,
    title ,
    content 
} : BlogshowType ) => {
  return (
    <div className="container mx-auto px-2 py-8 max-w-10xl">
  <div className="grid grid-cols-10 gap-12">
    {/* Main content wrapper */}
    <div className="col-span-7">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{authorname}</h2>
          <p className="text-sm text-gray-500">Posted on {time}</p>
        </div>

        <h1 className="text-4xl font-bold mb-4">{title}</h1>

        <div className="prose prose-lg max-w-none">
          <BlogPost post={content}></BlogPost>
        </div>
      </div>
    </div>

    {/* Author info wrapper */}
    <div className="col-span-3">
      <div className="bg-white rounded-t-lg p-6 shadow-lg sticky top-16">
      <h3 className="font-bold text-2xl text-center mb-4">Ranveer Bachche</h3>
      <button className="w-full bg-purple-600 text-white py-3 rounded-md mb-4 text-lg hover:bg-blue-700 transition duration-300">Follow</button>
      <p className="text-base mb-4">As a dedicated advocate for knowledge sharing, frequently writes about cutting-edge technologies, best practices, and programming languages.</p>
      <div className="space-y-2 text-base">
        <p><strong>EDUCATION</strong></p>
        <p><strong>WORK</strong></p>
        <p><strong>JOINED</strong></p>
      </div>
    </div>
  </div>
  </div>
  </div>
  )
};





