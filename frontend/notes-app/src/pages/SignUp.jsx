import React, { useState } from 'react'
import NavBar from "./NavBar"
import PasswordInput from '../components/Input/PasswordInput';
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';

const SignUp = () => {

  //handling states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //onsubmit signup 
  const handleSignUp = async(e)=>{
    e.preventDefault();

    //error handling
    if(!name){
      setError("Please enter your name.");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Please enter your password.");
      return;
    }

    setError("");

    //Create Account API
    try{
      const response = await axiosInstance.post("/create-account",{
        fullName : name,
        email : email,
        password : password
      });
      
      //handle successful register response
      if(response.data && response.data.error){
        setError(response.data.message);
        return;
      }
      //if Signup successful, accessToken will get generated
      if(response.data && response.data.accessToken){
        //saves in local storage
        localStorage.setItem("token",response.data.accessToken);
        navigate("/dashboard");
      }
    } catch(error){
      //Signup failed
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured! Please try again.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>

            {/* Name input field */}
            <input
              type="text"
              placeholder="Name"
              className='input-box'
              value={name}
              onChange={(e) => { setName(e.target.value) }}
            />
            {/* Email input field */}
            <input
              type="text"
              placeholder="Email"
              className='input-box'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            {/* Password input field */}
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />

            {/* wrong email or password error messages */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/*Login Button*/}
            <button type='submit' className='btn-primary'>Sign Up</button>
            <p className='text-sm text-center mt-4'>Already have an account? {" "}
              <Link to="/" className="font-medium text-primary underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp