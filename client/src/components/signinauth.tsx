import { useState } from "react" ;
import { useNavigate } from "react-router-dom" ;
import { Input } from "./input" ;
import { SignInType } from "@veerajsingh/common" ;
import axios from "axios" ;
import { url } from '../BackendURL' ;


export const SignInAuth = () => {
    const navigate = useNavigate() ;

    const [SigninState,setSigninState] = useState<SignInType>({
        email : "" ,
        password : "" 
    });

    //Handle Login API Integration here
    const authenticateUser = async () => {
        try{
            const res =  await axios.post(`${url}/api/v1/user/signin`,SigninState)
            const token = `Bearer ${res.data.token}` 
            localStorage.setItem("token",token)
            navigate('/blogs')}
        catch (error) {
            console.error('Error:', error);
            alert('Login failed');
        }
    }

    return(
        <div className="mt-8 space-y-4" >
        <div className="space-y-2">
            <Input 
                label="Email" 
                placeholder="user@app.com"
                onChange={(e) => {
                    setSigninState({
                        ...SigninState ,
                        email : e.target.value 
                    })
                }}
            />
            <Input 
                label="Password" 
                placeholder="123456"
                onChange={(e) => {
                    setSigninState({
                        ...SigninState ,
                        password : e.target.value 
                    })
                }}
            />
        </div>
        <button
            type='submit'
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10"
            onClick={authenticateUser}>
            Signin
        </button>
        </div>      
    )
}