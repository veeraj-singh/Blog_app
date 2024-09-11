import { BrowserRouter, Route, Routes } from 'react-router-dom' ;
import { Blog } from './pages/Blog' ;
import { Blogs } from './pages/Blogs' ;
import { SignIn } from './pages/SignIn' ;
import { SignUp } from './pages/SignUp' ;

function App() {
return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp/>} ></Route>
          <Route path="/signin" element={<SignIn/>} ></Route>
          <Route path="/blog/:id" element={<Blog/>} ></Route>  
          <Route path="/blogs" element={<Blogs/>} ></Route>  
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
