import { useState , useRef , useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { url } from '../BackendURL' ;
import DOMPurify from 'dompurify';
import { Save , Tag , PenTool } from 'lucide-react';

const TextEditor = ({id} : {id : string | undefined}) => {
  const [content, setContent] = useState<any>(null);
  const [jsoncontent, setjsonContent] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const quillRef = useRef(null);
  const navigate = useNavigate() ;

  const addpost = async () => {
      const method = id ? 'put' : 'post';
      const endpoint = id ? `${url}/api/v1/blog/${id}` : `${url}/api/v1/blog`;
      const token = localStorage.getItem("token") ;
      if(token){
        try {
          axios[method](endpoint, {
            title,
            topic,
            content: jsoncontent
          }, {
            headers: {
              Authorization : token
            }
          }).then(res => navigate(`/blog/${res.data.id}`));
        } catch (error) {
          console.error("Error saving blog post:", error);
        }
      }
  };

  const handleSave = () => {
    const c = JSON.stringify(convertToJSON(content))
    setjsonContent(c);
  };

  useEffect(() => {
    if (jsoncontent) {
      addpost();
    }
  }, [jsoncontent]);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  },[id]);

  const fetchBlogPost = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setTitle(res.data.title);
      setTopic(res.data.topic);
      const quillDelta = convertJSONToQuillDelta(JSON.parse(res.data.content));
      setContent(quillDelta);
    } catch (error) {
      console.error("Error fetching blog post:", error);
    }
  };

  const convertJSONToQuillDelta = (jsonContent: any[]): any[] => {
    const delta: any[] = [];
  
    const parseHtmlToInline = (html: string): any[] => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const inlineDelta: any[] = [];
  
      const parseNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          if (text.trim()) {
            inlineDelta.push({ insert: text });
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          const attributes: any = {};
  
          if (element.style.color) attributes.color = element.style.color;
          if (element.style.fontSize) attributes.size = element.style.fontSize;
  
          switch (element.tagName.toLowerCase()) {
            case 'strong':
            case 'b':
              attributes.bold = true;
              break;
            case 'em':
            case 'i':
              attributes.italic = true;
              break;
            case 'u':
              attributes.underline = true;
              break;
            case 'strike':
            case 's':
              attributes.strike = true;
              break;
            case 'a':
              attributes.link = (element as HTMLAnchorElement).href;
              break;
            case 'br':
              inlineDelta.push({ insert: '\n' });
              return;
          }
  
          Array.from(element.childNodes).forEach(parseNode);
  
          if (Object.keys(attributes).length > 0) {
            const lastOp = inlineDelta[inlineDelta.length - 1];
            if (lastOp && typeof lastOp.insert === 'string') {
              lastOp.attributes = { ...lastOp.attributes, ...attributes };
            }
          }
        }
      };
  
      Array.from(doc.body.childNodes).forEach(parseNode);
      return inlineDelta;
    };
  
    const handleList = (content: string | string[], listType: string) => {
      const items = Array.isArray(content) ? content : content.split(/(?=<li>)/);
      items.forEach((item: string) => {
        const cleanItem = item.replace(/<\/?li>/g, '').trim();
        if (cleanItem) {
          delta.push(...parseHtmlToInline(cleanItem));
          delta.push({
            insert: '\n',
            attributes: { list: listType }
          });
        }
      });
    };
  
    jsonContent.forEach(item => {
      const baseAttributes: any = {};
      if (item.style) {
        if (item.style.color) baseAttributes.color = item.style.color;
        if (item.style.fontSize) baseAttributes.size = item.style.fontSize;
      }
  
      switch (item.type) {
        case 'heading':
          delta.push(...parseHtmlToInline(item.content));
          delta.push({
            insert: '\n',
            attributes: {
              ...baseAttributes,
              header: item.level || 1
            }
          });
          break;
        case 'paragraph':
          delta.push(...parseHtmlToInline(item.content));
          delta.push({ insert: '\n' });
          break;
        case 'code':
          delta.push({
            insert: DOMPurify.sanitize(item.content, { ALLOWED_TAGS: [] }),
            attributes: {
              ...baseAttributes,
              'code-block': item.language || true
            }
          });
          delta.push({ insert: '\n' });
          break;
        case 'unorderedList':
          handleList(item.content, 'bullet');
          break;
        case 'orderedList':
          handleList(item.content, 'ordered');
          break;
        case 'image':
          delta.push({
            insert: {
              image: item.src
            },
            attributes: {
              alt: item.alt
            }
          });
          if (item.caption) {
            delta.push(...parseHtmlToInline(item.caption));
            delta.push({
              insert: '\n',
              attributes: {
                ...baseAttributes,
                align: 'center',
                italic: true
              }
            });
          }
          break;
        case 'blockquote':
          delta.push(...parseHtmlToInline(item.content));
          delta.push({
            insert: '\n',
            attributes: {
              ...baseAttributes,
              blockquote: true
            }
          });
          break;
        case 'link':
          delta.push(...parseHtmlToInline(item.content));
          delta[delta.length - 1].attributes = {
            ...delta[delta.length - 1].attributes,
            ...baseAttributes,
            link: item.href
          };
          break;
        default:
          delta.push(...parseHtmlToInline(item.content));
          delta.push({ insert: '\n' });
      }
    });
  
    return delta;
  };

  const convertToJSON = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
  
    const generateId = (() => {
      let id = 0;
      return () => `content-${id++}`;
    })();
  
    const convertNode = (node: Element) => {
      const baseItem = {
        id: generateId(),
        style: {
          fontSize: window.getComputedStyle(node).fontSize,
          color: window.getComputedStyle(node).color
        }
      };
  
      switch (node.nodeName) {
        case 'P':
          return {
            ...baseItem,
            type: 'paragraph',
            content: node.innerHTML
          };
  
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
          return {
            ...baseItem,
            type: 'heading',
            content: node.textContent || '',
            level: parseInt(node.nodeName.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6
          };
  
        case 'PRE':
          const codeNode = node.querySelector('code');
          return {
            ...baseItem,
            type: 'code',
            content: codeNode ? codeNode.textContent || '' : node.textContent || '',
            language: codeNode?.className.replace('language-', '') || 'plaintext'
          };
  
        case 'A':
          return {
            ...baseItem,
            type: 'link',
            content: node.textContent || '',
            href: node.getAttribute('href') || '#'
          };
  
        case 'IMG':
          return {
            ...baseItem,
            type: 'image',
            src: node.getAttribute('src') || '',
            alt: node.getAttribute('alt') || '',
            caption: node.getAttribute('title') || undefined
          };
  
        case 'UL':
        case 'OL':
          return {
            ...baseItem,
            type: node.nodeName === 'UL' ? 'unorderedList' : 'orderedList',
            content: Array.from(node.children).map(li => li.innerHTML)
          };
  
        case 'BLOCKQUOTE':
          return {
            ...baseItem,
            type: 'blockquote',
            content: node.innerHTML
          };
  
        case 'TABLE':
          return {
            ...baseItem,
            type: 'table',
            content: node.outerHTML
          };
  
        default:
          return {
            ...baseItem,
            type: 'unknown',
            content: node.outerHTML
          };
      }
    };
  
    const processChildNodes = (parentNode: Element) : any => {
      return Array.from(parentNode.children).flatMap(node => {
        if (node.children.length > 0 && node.nodeName !== 'PRE' && node.nodeName !== 'UL' && node.nodeName !== 'OL' && node.nodeName !== 'TABLE') {
          return processChildNodes(node);
        } else {
          return convertNode(node);
        }
      });
    };
  
    return processChildNodes(doc.body);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', 'medium', 'large', 'x-large'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['code-block', 'link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Blog Post</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
          <PenTool className="inline mr-2" size={18} />
          Post Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an engaging title"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="topic">
          <Tag className="inline mr-2" size={18} />
          Post Topic
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Specify the main topic"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="content">
          Content
        </label>
        <ReactQuill 
          ref={quillRef}
          theme="snow"
          value={content} 
          onChange={setContent} 
          modules={modules}
          className="h-96 mb-12 border rounded-md" 
        />
      </div>
      
      <button
        onClick={handleSave}
        className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out"
      >
        <Save className="mr-2" size={18} />
        {id ? 'Update Post' : 'Publish Post'}
      </button>
    </div>
  );
};

export default TextEditor;