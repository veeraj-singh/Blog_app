import {Link} from 'react-router-dom'

interface HeaderTypes {
    heading : string ,
    paragraph : string ,
    linkName : string ,
    linkUrl : string
}

export const Header = ({
    heading ,
    paragraph,
    linkName,
    linkUrl="#"
} : HeaderTypes) => {
    return(
        <div className="mb-10">
            <div className="flex justify-center">
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
            {paragraph} {' '}
            <Link to={linkUrl} className="font-medium text-purple-600 hover:text-purple-500">
                {linkName}
            </Link>
            </p>
        </div>
    )
};