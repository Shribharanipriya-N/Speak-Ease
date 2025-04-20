import React,{useState} from 'react'
import logo from '../images/logo.png'
import { FaUser } from "react-icons/fa6";
import UserProfile from './UserProfile';
import '../index.css'
const NavBar = () => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };
  return (
    
    <>
      <nav>
        <div className='navbar'>
          <img  className='logo' src={logo} alt='logo'></img> 
          <p className='title'>Speak Ease</p> 
          <FaUser size={33}  onClick={toggleUserProfile}/>
        </div>
      </nav>
      {showUserProfile && <UserProfile onClose={toggleUserProfile} />}
    </>
  )
}

export default NavBar

