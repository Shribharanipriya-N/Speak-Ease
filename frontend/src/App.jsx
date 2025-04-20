import React from 'react'
import Firstpage from './components/Firstpage'
import Signup from './components/Signup'
import Login from './components/Login';
import Body from './components/Body';
import {BrowserRouter ,Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Firstpage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Body />} />
        </Routes>
        <ToastContainer/>
      </BrowserRouter>
      
    </div>
  )
}

export default App

