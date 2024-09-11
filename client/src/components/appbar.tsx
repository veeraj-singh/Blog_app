
export const Appbar = ({authorname} : {authorname : string}) => {
    return (
        <div className="bg-purple-600 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="text-2xl font-semibold text-[#f8fafc]">
                Text Base
            </div>
            <div className="flex items-center space-x-6">
                <div>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-[#f5f5f4] text-black rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                </div>

                <Avatar name={authorname}></Avatar>
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