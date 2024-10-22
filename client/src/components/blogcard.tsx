import { Link } from "react-router-dom" ;
import axios from "axios" ;
import { useState } from "react";
import { url } from "../BackendURL";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Heart, Share2 , Check } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

interface BlogCardType {
    id : string ,
    authorname : string ,
    topic : string ,
    title : string ,
    likes : number ,
    ed : number
} ;

export const BlogCard = ({
    id ,
    authorname ,
    topic ,
    title ,
    likes ,
    ed
} : BlogCardType) => {
    const navigate = useNavigate() ;
    const [likescnt, setLikescnt] = useState(likes);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLike = async () => {
      try {
        const response = await axios.post(`${url}/api/v1/blog/${id}/like`, null, {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        
        if (response.status === 200) {
          setLikescnt(response.data.likes);
        }
      } catch (error) {
        console.error("Error updating like:", error);
      }
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(`http://localhost:5173/blog/${id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    const deletepost = async () => {
        try {
            const res = await axios.delete(`${url}/api/v1/blog`, {
              headers: {
                Authorization: localStorage.getItem("token")
              },
              data: { id: id }
            });
            if (res.status === 200) {
              navigate(0); 
            }
          } catch (error) {
            console.error("Error deleting post:", error);
          }
      }

      const updatepost = async () => {
        navigate(`/publish/${id}`) ;
      }
      
    return (
      <div className="relative h-72 flex flex-col justify-between w-full text-left bg-center bg-cover dark:bg-gray-100 dark:text-gray-800">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
          <button onClick={()=>navigate('/blogs/user')} className="flex items-center">
            <Avatar name={authorname} />
            <div className="px-4 py-2 text-lg font-semibold leading-none tracking-wide">{authorname}</div>
          </button>
        {ed ? (
            <div className="flex items-center space-x-4">
              <button onClick={updatepost} className="text-purple-500 hover:text-purple-700">
                <Edit size={18} />
              </button>
              <button onClick={() => setIsModalOpen(true)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
              <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={deletepost}
              />
            </div>
          ) : (<Link to={`/explore-topic/${topic}`} className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-[#f8fafc] bg-purple-600 hover:bg-purple-700 ">{topic}</Link>)}
      </div>
      <div className="z-10 p-5 mt-auto">
        <h2 className="mb-2">
          <Link to={`/blog/${id}`} className="font-medium text-lg hover:underline dark:text-gray-800">
            {title}
          </Link>
        </h2>
        <div className="flex items-center text-gray-500">
          {/* <button className="flex items-center mr-4 hover:text-gray-700">
            <MessageSquare size={18} className="mr-1" />
            <span>24</span>
          </button> */}
          <button 
            className="flex items-center mr-4 hover:text-red-500"
            onClick={handleLike}>
            <Heart size={18} className="mr-1" />
            <span>{likescnt}</span>
          </button>
          <button onClick={copyToClipboard}
          className="flex items-center hover:text-blue-500">
            {copied ? (
              <>
                <Check size={20} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={18} className="mr-1" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} ;

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete } : DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 z-50">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function Avatar({name} : {name : string}){
    const initials = name.split(' ')
    return (
        <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">{initials[0][0]}{initials[1][0]}</span>
        </div>
    )
} ;
