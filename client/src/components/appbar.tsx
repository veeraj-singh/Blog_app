import { Link } from "react-router-dom" ;
import logo from '../assets/textbase.svg';
import { PenSquare , Bell } from "lucide-react";
import  EnhancedSearch  from './search'

export const Appbar = ({authorname , authorId} : {authorname : string , authorId : string}) => {
    
    return (
        <div className="bg-purple-600 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to={'/blogs'} className="text-2xl font-semibold text-white">
          <img src={logo} alt="TextBase Logo" className="w-36 h-36" />
        </Link>
        
        <div className="flex-grow mx-8 max-w-xl relative">
          <EnhancedSearch></EnhancedSearch>
          {/* <input 
            type="text" 
            placeholder="Search posts..."
            className="w-full py-2 px-4 pl-10 bg-purple-500 text-white placeholder-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={18} /> */}
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to={`/publish`}>
            <button className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-purple-100 transition-colors duration-200 font-semibold">
              <PenSquare size={18} className="mr-2" />
              Write
            </button>
          </Link>
          
          <button className="text-white hover:text-purple-200 transition-colors duration-200">
            <Bell size={24} />
          </button>
          
          <Link to={`/profile/${authorId}`} className="flex items-center space-x-2">
            <Avatar name={authorname} />
            <span className="font-medium">{authorname}</span>
          </Link>
        </div>
      </div>
    )
} ;

function Avatar({name} : {name : string}){
    const initials = name.split(' ')
    return (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-[#f5f5f4] rounded-full ">
            <span className="font-medium text-black ">{initials[0][0]}{initials[1][0]}</span>
        </div>
    )
}

{/* <div className="relative max-w-md w-full">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-2 px-4 pr-10 rounded-full bg-[#f5f5f4] text-purple-600 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600" size={20} />
            </div>  */}

