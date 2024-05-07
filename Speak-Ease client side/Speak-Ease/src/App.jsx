import React from 'react'
import Firstpage from './components/Firstpage'
import Signup from './components/Signup'
import Login from './components/Login';
import Body from './components/Body';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter ,Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Firstpage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/body" element={<Body />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App

