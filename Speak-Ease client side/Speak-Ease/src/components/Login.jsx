import React from 'react'
import '../index.css'
import { useState } from 'react';
import login from '../images/login.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
     const response=await  axios.post('http://localhost:4000/login', { name,password })
      const userdata=response.data;
      if(userdata&&userdata.id){
        sessionStorage.setItem('userId',userdata.id);
        navigate('./body')
      }
      else{
        window.alert("Invalid username or password");
      }
    }
    
      catch(error){
        console.error("error occured during login",error);
        window.alert("Error occured during login. Please try again");
      };
  };
  return (

    <div className='loginContainer'>
     <div className='loginLeft'>
     <img src={login} alt="Login Image" />
     </div>
     <div className='loginRight'>
      <h1 className='gradient-login-text1'style={{ fontSize: '50px',marginBottom:'50px', fontWeight:'bold' ,marginLeft:'30px'}}>WELCOME BACK</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username"style={{fontSize:'38px',fontWeight:'bold'}}className='my-text-style-login'>Username</label>
          <input type="text" id="username" name="username"style={{marginLeft:'50px'}}
          onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="password"style={{fontSize:'38px',fontWeight:'bold'}}className='my-text-style-login'>Password</label>
          <input type="password" id="password" name="password"style={{marginLeft:'60px'}}
           onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className='loginbt' style={{fontSize:'22px',fontWeight:'bold'}}>Login</button>
      </form>
    </div>

    </div>
  )
}
export default Login