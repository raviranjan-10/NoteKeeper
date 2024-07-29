import React, { useState } from 'react'
import NavBar from "./NavBar"
import {Link, useNavigate} from "react-router-dom"
import PasswordInput from '../components/Input/PasswordInput'
import {validateEmail} from '../utils/helper'
import axiosInstance from "../utils/axiosInstance"
const Login = () => {

  //handling states
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();
  //error handling
  const handleLogin = async(e)=>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("enter a valid email address.");
      return;
    }

    if(!password){
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login API call
    try{
      const response = await axiosInstance.post("/",{
        email : email,
        password : password
      });

      //if login successful, accessToken will get generated
      if(response.data && response.data.accessToken){
        //saves in local storage
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard");
      }
    } catch(error){
      //Login failed
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured! Please try again.");
      }
    }

  
  };
  return (
    <>
    <NavBar/>
    <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleLogin}>
                <h4 className="text-2xl mb-7">Login</h4>

                {/*Email input field*/}
                <input 
                type="text" 
                placeholder="Email" 
                className='input-box'
                value = {email}
                onChange = {(e)=>{
                  setEmail(e.target.value);}}
                />

                {/*Password input field*/}
                <PasswordInput
                value={password}
                  onChange={(e)=>{setPassword(e.target.value);}}
                />
                {/* wrong email or password error messages */}
                {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                {/*Login Button*/}
                <button type='submit' className='btn-primary'>Login</button>
                <p className='text-sm text-center mt-4'>Not Registered Yet? {" "}
                <Link to="/signup" className="font-medium text-primary underline">Create Account</Link>
                </p>
            </form>
        </div>
    </div>
    </>
  )
}

export default Login