
  
  export interface ContentItem{
    id: string ;
    type: 'paragraph' | 'heading' | 'code' | 'image' | 'link' | 'unorderedList' | 'orderedList' | 'blockquote' | 'table' | 'unknown' ;
    content?: string | string[];
    style?: {
      fontSize?: string;
      color?: string;
    };
  }
  
  interface ParagraphItem extends ContentItem {
    type: 'paragraph';
    content: string;
  }
  
  interface HeadingItem extends ContentItem {
    type: 'heading';
    content: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  }
  
  interface CodeItem extends ContentItem {
    type: 'code';
    content: string;
    language: string;
  }
  
  interface ImageItem extends ContentItem {
    type: 'image';
    src: string;
    alt: string;
    caption?: string;
  }
  
  interface LinkItem extends ContentItem {
    type: 'link';
    content: string;
    href: string;
  }

  interface ListItem extends ContentItem {
    type: 'unorderedList' | 'orderedList';
    content: string[];
  }
  
  // interface BlockquoteItem extends ContentItem {
  //   type: 'blockquote';
  //   content: string;
  // }
  
  // interface TableItem extends ContentItem {
  //   type: 'table';
  //   content: string;
  // }
  
  interface UnknownItem extends ContentItem {
    type: 'unknown';
    content: string;
  }
  
  //Component props interfaces
  interface ParagraphProps extends ParagraphItem {}
  interface HeadingProps extends HeadingItem {}
  interface CodeProps extends CodeItem {}
  interface ImageProps extends ImageItem {}
  interface LinkProps extends LinkItem {}
  interface ListProps extends ListItem {}
  // interface BlockquoteProps extends BlockquoteItem {}
  // interface TableProps extends TableItem {}
  interface UnknownProps extends UnknownItem {}
  
  const Paragraph: React.FC<ParagraphProps> = ({ content, style }) => (
    <p className={`mb-4 ${style?.color}`} style={{ fontSize: style?.fontSize }}>
      <span dangerouslySetInnerHTML={{ __html: content }} />
    </p>
  );
  
  const Heading: React.FC<HeadingProps> = ({ content, level, style }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <Tag className={`mb-4 font-bold ${style?.color}`} style={{ fontSize: style?.fontSize }}>
        {content}
      </Tag>
    );
  };
  
  const Code: React.FC<CodeProps> = ({ content, language }) => (
    <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-x-auto">
      <code className={`language-${language}`}>{content}</code>
    </pre>
  );
  
  const Image: React.FC<ImageProps> = ({ src, alt, caption }) => (
    <figure className="mb-4">
      <img src={src} alt={alt} className="w-full rounded-md" />
      {caption && <figcaption className="text-center text-sm text-gray-600 mt-2">{caption}</figcaption>}
    </figure>
  );
  
  const Link: React.FC<LinkProps> = ({ content, href, style }) => (
    <a href={href} className={`${style?.color} hover:underline`}>
      {content}
    </a>
  );

  const List: React.FC<ListProps> = ({ type , content}) => {
    if(type == 'unorderedList'){
      return(
        <ul className="list-disc list-inside">
          {content.map((li, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: li }} />
          ))}
        </ul>)
      }
      if(type == 'orderedList'){
        return(
        <ol className="list-decimal list-inside">
          {content.map((li, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: li }} />
          ))}
        </ol>)
      }
  };
        
  const Unknown: React.FC<UnknownProps> = ({ content }) => (
    <div className="mb-4" dangerouslySetInnerHTML={{ __html: content }} />
  );

export const BlogPost: React.FC<{ post : ContentItem[]  }> = ({ post }) => {
    const renderContent = (item: ContentItem) => {
      switch (item.type) {
        case 'paragraph':
          return <Paragraph key={item.id} {...item as ParagraphItem} />;
        case 'heading':
          return <Heading key={item.id} {...item as HeadingItem} />;
        case 'code':
          return <Code key={item.id} {...item as CodeItem} />;
        case 'image':
          return <Image key={(item as ImageItem).src} {...item as ImageItem} />;
        case 'link':
          return <Link key={(item as LinkItem).href} {...item as LinkItem} />;
        case 'unorderedList':
          return <List key={item.id} {...item as ListItem} />
        case 'orderedList':
          return <List key={item.id} {...item as ListItem} />
        case 'unknown':
          return <Unknown key={item.id} {...item as UnknownItem} />;
        default:
          return null;
      }
    };

    // console.log(post)
    // console.log(typeof post)
  
    return (
      <article className="max-w-2xl mx-auto p-6">
        {post.map(item => (
        renderContent(item)
      ))}
      </article>
    );
  };


