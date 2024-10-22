import { useState, useEffect } from 'react';
import { Search , ChevronDown } from 'lucide-react';
import { url } from '../BackendURL';
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom';

const EnhancedSearch = () => {
    const [searchField, setSearchField] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
  
    const searchFields = ['author', 'topic', 'title'];
    const navigate = useNavigate() ;
  
    useEffect(() => {
      if (searchTerm.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, [searchTerm, searchField]);
  
    const fetchSuggestions = async () => {
        try {
          let response = await axios.get(`${url}/api/v1/blog/search`, 
            {
                params: {
                    field: searchField,
                    term: searchTerm ,
                    suggestion: true 
            } ,
            headers: {
              'Authorization': localStorage.getItem('token') 
            }
          });
          const suggestionData = response.data;
          console.log(suggestionData)
          setSuggestions(suggestionData.map((item : any) => (item.suggestion || item.name || item.email)+"#"+item.id));
        } catch (error : any) {
          console.error('Error fetching suggestions:', error.response?.data?.error || error.message);
          setSuggestions([]);
        }
    };
    
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await axios.get(`${url}/api/v1/blog/search`, {
          params: {
            field: searchField,
            term: searchTerm 
          },
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        });
        
        const results = response.data;
        let path = '';
        switch (searchField) {
          case 'author':
            path = `/author/${results[0]?.id}`;
            break;
          case 'topic':
            path = `/explore-topic/${encodeURIComponent(searchTerm)}`;
            break;
          case 'title':
            path = `/blog/${results[0]?.id}`;
            break;
          default:
            console.error('Unknown search field:', searchField);
            return;
        }
        
        if (path) {
          navigate(path);
        }
      } catch (error: any) {
        console.error('Error performing search:', error.response?.data?.error || error.message);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setSearchTerm(suggestion.split('#')[0]);
      setSuggestions([]);
  };

    return (
      <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center bg-white shadow-lg rounded-full overflow-hidden">
        <div className="relative">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="appearance-none bg-transparent text-gray-700 py-3 pl-4 pr-10 rounded-l-full focus:outline-none cursor-pointer"
          >
            <option value="" disabled>Select field</option>
            {searchFields.map((field) => (
              <option key={field} value={field} className="text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-purple-500">
            <ChevronDown size={18} />
          </div>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="flex-grow bg-transparent text-gray-700 py-3 px-4 focus:outline-none"
        />
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition duration-300 ease-in-out">
          <Search size={20} />
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white text-gray-700 mt-2 rounded-lg shadow-xl overflow-hidden divide-y divide-gray-100">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition duration-200 ease-in-out flex items-center space-x-3"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search size={16} className="text-purple-400" />
              <span>{suggestion.split('#')[0]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    );
  };
  
export default EnhancedSearch;