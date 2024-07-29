import React from 'react'
import { getInitials } from "../utils/helper"
const ProfileInfo = ({userInfo, onLogout }) => {
  return (
    userInfo && <div className='flex items-center gap-3'>

      {/* Profile icon */}
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200'>{getInitials(userInfo.fullName)}</div>
      <div>
        {/* Name of User */}
        <p className='text-sm font-medium'>{userInfo.fullName}</p>
        <button className='text-sm text-slate-700 underline' onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInfo