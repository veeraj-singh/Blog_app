
interface InputTypes {
    label : string ,
    placeholder : string ,
    onChange : (e : React.ChangeEvent<HTMLInputElement>) => void 
}

export const Input = ({label,placeholder,onChange} : InputTypes) => {
    return (
        <div>
            <div className="block mb-2 text-sm font-medium text-gray-900 ">{label}</div>
            <input onChange={onChange} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
        </div>
    )
}