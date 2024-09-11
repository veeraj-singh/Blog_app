import { useState } from "react" ;
import { useNavigate } from "react-router-dom" ;
import { Input } from "./input";
import { SignUpType } from "@veerajsingh/common";
import { url } from '../BackendURL'
import axios from 'axios'

export const SignUpAuth = () => {
    const navigate = useNavigate()
    const [SignupState,setSignupState] = useState<SignUpType>({
        email : "" ,
        password : "" ,
        name : "" 
    });

    const handleSubmit = (e : React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createaccount();
    }

    //Handle Login API Integration here
    const createaccount = async () =>{
        const res = await axios.post(`${url}/api/v1/user/signup`,SignupState)
        const token = `Bearer ${res.data.token}`
        localStorage.setItem("token",token)
        navigate('/blogs')
    }

    return(
        <form className="mt-8 space-y-4" >
        <div className="space-y-2">
            <Input 
                label="Email" 
                placeholder="user@app.com"
                onChange={(e) => {
                    setSignupState({
                        ...SignupState ,
                        email : e.target.value 
                    })
                }}
            />
            <Input 
                label="Password" 
                placeholder="123456"
                onChange={(e) => {
                    setSignupState({
                        ...SignupState ,
                        email : e.target.value 
                    })
                }}
            />
            <Input 
                label="Name" 
                placeholder="Ben Stokes"
                onChange={(e) => {
                    setSignupState({
                        ...SignupState ,
                        email : e.target.value 
                    })
                }}
            />
        </div>
        <button
            type='submit'
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onSubmit={handleSubmit}>
            Signup
        </button>
      </form>      
    )
} ;