import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs';
import { TopicBlogPage } from './pages/Blogs_topic';
import { AuthorBlogPage } from './pages/Blogs_author';
import { Publish } from './pages/Publish';
import { Profile } from './pages/Profile';
import { AuthorForm } from './pages/Form';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};


const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/blogs" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Accessible only when not logged in) */}
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />

        {/* Protected Routes (Require authentication) */}
        <Route 
          path="/blog/:id" 
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/blogs" 
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore-topic/:topic" 
          element={
            <ProtectedRoute>
              <TopicBlogPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/author/:authorId" 
          element={
            <ProtectedRoute>
              <AuthorBlogPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publish/:id" 
          element={
            <ProtectedRoute>
              <Publish />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/publish" 
          element={
            <ProtectedRoute>
              <Publish />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:authorId" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/form/:authorId" 
          element={
            <ProtectedRoute>
              <AuthorForm />
            </ProtectedRoute>
          } 
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/blogs" replace />} />
        <Route path="*" element={<Navigate to="/blogs" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;