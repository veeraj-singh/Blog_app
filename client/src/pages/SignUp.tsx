import { SignUpAuth } from '../components/signupauth' ;
import { Header } from '../components/header' ;

export const SignUp = () => {
    return(
        <div className="min-h-screen bg-[#ecddfb] text-gray-900 flex justify-center">
            <div className="min-h-full h-screen flex items-center justify-center py-12 px-8 sm:px-12 lg:px-20">
                <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                <div className="max-w-md w-full space-y-8">
                    <Header
                    heading="Signup to create an account"
                    paragraph="Already have an account? "
                    linkName="Signin"
                    linkUrl="/signin"
                    />
                    <SignUpAuth />
                </div>
                </div>
            </div>
            <div className="flex-1 bg-[#ecddfb] text-center hidden lg:flex">
                <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat h-fit">
                    <img src="https://cdn.dribbble.com/users/3548419/screenshots/14515054/media/397031b8bc9165b12680740317bdaaf3.png"  className='w-full lg:max-h-[575px] object-contain'/>
                </div>
            </div>
        </div>
    )
}