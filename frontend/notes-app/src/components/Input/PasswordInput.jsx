import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6";
const PasswordInput = ({value, onChange, placeholder}) => {
    
    //password visibility
    const [isShowPassword,setIsShowPassword] = useState(false);

    //change password visibility
    const toggleShowPassword = ()=>{
        setIsShowPassword(!isShowPassword);
    };
    
    
    return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
        <input className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
            value={value}
            type = { isShowPassword ? "text" : "password"}
            onChange={onChange}
            placeholder={placeholder || "Password"}
        />

        {/* conditonal rendering of eye icons */}
        {isShowPassword ? <FaRegEye
            size={20}
            className='text-primary cursor-pointer'
            onClick={()=>{toggleShowPassword()}}
        /> : <FaRegEyeSlash
            size={20}
            className='text-slate-400 cursor-pointer'
            onClick={()=>{toggleShowPassword()}}
        />}
    </div>
  )
}

export default PasswordInput