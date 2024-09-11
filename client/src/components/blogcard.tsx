
interface BlogCardType {
    authorname : string ,
    topic : string ,
    title : string
} ;

export const BlogCard = ({
    authorname ,
    topic ,
    title 
} : BlogCardType) => {
    return (
        <div className="relative h-72 flex items-end justify-start w-full text-left  bg-center bg-cover dark:bg-gray-100 dark:text-gray-800">
			<div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
				<div className="flex">
                    <div className="flex flex-col justify-center">
                        <Avatar name={authorname}/>
                    </div>
					<div className=" px-4 py-2 text-lg font-semibold leading-none tracking-wide">{authorname}</div>
				</div>
				<a rel="noopener noreferrer" href="https://solana.com/" className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-[#f8fafc] bg-purple-600 hover:bg-purple-700 ">{topic}</a>
			</div>
			<h2 className="z-10 p-5">
				<a rel="noopener noreferrer" href="#" className="font-medium text-lg hover:underline dark:text-gray-800">{title}</a>
			</h2>
		</div>
    )
} ;

function Avatar({name} : {name : string}){
    const initials = name.split(' ')
    return (
        <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">{initials[0][0]}{initials[1][0]}</span>
        </div>
    )
}
