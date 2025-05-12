import React from 'react';
import "./Registration.css"
import { useNavigate } from "react-router-dom";
function Registration() {
      const  naviagte = useNavigate()

  return (
    <div className="container">
      <div className="registration-form">
        <h2>Registration</h2>
        <form>
          <div className="form-group">
            <label >Username</label>
            <input type="text"  name="username" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email"  name="email" />
          </div>
          <div className="form-group">
            <label >Password</label>
            <input type="password"  name="password" />
          </div>
          <div className="form-group">
            <label >Confirm Password</label>
            <input type="password" />    
          </div>
          <button type="submit" className='reaistatin_btn'>Register</button>
          <button className='back_btn' onClick={()=> naviagte("/")} >Back</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;