import React from 'react'
import logo from '../images/logo.png'
import { FaUser } from "react-icons/fa6";
const NavBar = () => {
  return (
    <>
      <nav>
        <div className='navbar'>
          <img  className='logo' src={logo} alt='logo'></img> 
          <p className='title'>Speak Ease</p> 
          <FaUser size={33}/>
        </div>
      </nav>
    </>
  )
}

export default NavBar

