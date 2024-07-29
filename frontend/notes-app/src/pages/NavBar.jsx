import React, { useState } from 'react'
import ProfileInfo from '../components/ProfileInfo'
import { useNavigate } from "react-router-dom";
import SearchBar from '../components/SearchBar';

const NavBar = ({userInfo, onSearchNote, handleClearSearch}) => {

  //navigate to login page on logout
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  //handling notes search functionalities
  const [searchQuery, setSearchQuery] = useState("");
  //search note
  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery);
    } else{
      getAllNotes();
    }
  };
  //clear note
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">NoteKeeper</h2>

      {/*search bar shows only when logged in, length of local storage will be greater than 0 if user is logged in */}
      {localStorage.length > 0 && <SearchBar
        value={searchQuery}
        onChange={({ target }) => { setSearchQuery(target.value) }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />}
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default NavBar