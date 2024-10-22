import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthorInfo } from '../custom_hooks';
import { Appbar } from '../components/appbar';
import axios from 'axios';
import { url } from '../BackendURL';

interface DecodedToken {
  id: string;
  user: string;
}

interface CustomSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export const AuthorForm = () => {
  const params = useParams();
  const authorId = params.authorId || "";
  const [user, setUser] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [localFormData, setLocalFormData] = useState<AuthorFormData>({
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
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const { formData: fetchedData, isloading } = useAuthorInfo({ authorId });

  // Handle JWT decoding
  useEffect(() => {
    const payload: DecodedToken = jwtDecode(localStorage.getItem('token') || '{}');
    setUser(payload.user);
  }, []);

  useEffect(() => {
    if (fetchedData && !isInitialized) {
      setLocalFormData(fetchedData);
      setIsInitialized(true);
    }
  }, [fetchedData, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const output = await axios.put(`${url}/api/v1/user/${authorId}`,localFormData,{
        headers : {
            Authorization : localStorage.getItem('token')
        }
    }) ;
    if(output.status == 200){
      setShowSuccess(true);
    }
  };

  if (isloading) {
    return (
      <>
        <div className="w-full h-14 bg-gray-200 animate-pulse"></div>
        <div className="h-full w-full flex justify-center items-center">
          <div className="spinner-border animate-spin absolute top-0 left-0 right-0 bottom-0 m-auto h-12 w-12 border-4 border-b-purple-500 rounded-full"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Appbar authorname={user} authorId={authorId} />
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Author Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.name}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.email}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            {/* Bio field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio *
              </label>
              <textarea
                id="bio"
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.bio}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            {/* Education field */}
            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                Education
              </label>
              <input
                type="text"
                id="degree"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.degree}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>

            {/* Position field */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Work
              </label>
              <input
                type="text"
                id="position"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.position}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Joined date field */}
            <div>
              <label htmlFor="joined" className="block text-sm font-medium text-gray-700">
                Joined Date
              </label>
              <input
                type="date"
                id="joined"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.joined}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, joined: e.target.value }))}
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Social Links</h3>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={localFormData.socialLinks.twitter}
                  onChange={(e) => setLocalFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={localFormData.socialLinks.linkedin}
                  onChange={(e) => setLocalFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub
                </label>
                <input
                  type="url"
                  id="github"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={localFormData.socialLinks.github}
                  onChange={(e) => setLocalFormData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, github: e.target.value }
                  }))}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            {/* Profile Image field */}
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                Profile Image URL
              </label>
              <input
                type="url"
                id="profileImage"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={localFormData.profileImage}
                onChange={(e) => setLocalFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                placeholder="https://example.com/profile-image.jpg"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Save Author Information
              </button>
            </div>
          </form>
          <CustomSuccessPopup 
            isOpen={showSuccess} 
            onClose={() => setShowSuccess(false)} 
          />
        </div>
      </div>
    </div>
  );
};

const CustomSuccessPopup = ({ isOpen, onClose } : CustomSuccessPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="transform transition-all ease-in-out duration-300 bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 relative z-50">
        <div className="flex items-center space-x-4">
          {/* Success checkmark */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Success!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Author information has been updated successfully.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
  