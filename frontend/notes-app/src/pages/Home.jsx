import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import NoteCard from '../components/NoteCard'
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import ToastMessage from '../components/ToastMessage'
import EmptyCard from '../components/EmptyCard'
import NoNotes from "../assets/NoNotes.jpg"

const Home = () => {

  //stores all notes
  const [allNotes, setAllNotes] = useState([]);
  //stores users data
  const [userInfo, setUserInfo] = useState(null);
  //states for Modal Window
  const [openAddEditModal, setOpenAddEditModal] = useState(
    {
      isShown: false,
      type: "add",
      data: null,
    }
  );
  //handle toast message state 
  const [showToastMsg, setShowToastMsg] = useState({
    isShown:false,
    message : "",
    type : "add"
  });
  //handle search query state
  const [isSearch, setIsSearch] = useState(false); 
  // close toast message component
  const handleCloseToast=()=>{
    setShowToastMsg({
      isShown : false,
      message : ""
    });
  }
// shows toast message
  const showToastMessage=(message, type)=>{
    setShowToastMsg({
      isShown:true,
      message,
      type,
    });
  }
  const navigate = useNavigate();

  //handle edit note functionality
  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown:true, type:"edit", data: noteDetails});
  };

  //get User information
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      //if user found
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      //handle user error
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };
  //Get All Notes API
  const getAllNotes = async()=>{
    try{
      //API call to get-all-notes 
      const response = await axiosInstance.get("/get-all-notes");
      // if response data exists
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);   
      }
    }catch(error){
      console.log(error.message);
    }
  }

//Delete Note API call
const deleteNote = async(data)=>{
  //note to delete -> note id 
  const noteId = data._id;
        try{
          //delete note
            const response = await axiosInstance.delete("/delete-note/"+noteId);
            console.log(response);
            if(response.data && !response.data.error){  //note deleted successfully
                showToastMessage("Note deleted successfully","delete");
                getAllNotes();
            }
        } catch(error){
              // note delete error
                console.log("An unexpected error occured! Please try again.",error);
        }
}

//Search Note API call
const onSearchNote = async(query)=>{
  try{
    const response = await axiosInstance.get("/search-notes",{
      params:{query},
    });

    if(response.data && response.data.notes){
      setIsSearch(true);
      setAllNotes(response.data.notes);
    } 
  } catch(error){
    console.log("An unexpected error has occured! Please try again.",error);
  }
}

//clear search query
const handleClearSearch =() =>{
  setIsSearch(false);
  getAllNotes();
}

//update isPinned note
const updateIsPinned = async(noteData)=>{
  const noteId = noteData._id;
  try{
    const response = await axiosInstance.put("/update-note-pinned/"+noteId,{
      isPinned : !noteData.isPinned
    });
    if(response.data && response.data.note){
      showToastMessage("Note updated successfully.");
      getAllNotes();
    }
  } catch(error){
    console.log(error);
  }
}

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { };
  }, []);

  return (
    <>
      <NavBar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch = {handleClearSearch}/>
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>

          {/*Notes*/}
          {allNotes.map((item, index)=>(
            <NoteCard
            key = {item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)}
          />
          ))}
        </div>) : (<EmptyCard imgSrc={NoNotes} 
        message={isSearch ? "Oops! no notes found matching your search.":"Start creating your first Note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!"}/>)}
      </div>

      {/* Add New Note button, Opens Modal window */}
      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* modal window */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >

        {/* onClose function closes the modal window */}
        <AddEditNotes
        noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes = {getAllNotes}
          showToastMessage = {showToastMessage}

        />
      </Modal>
      <ToastMessage 
        isShown = {showToastMsg.isShown}
        message = {showToastMsg.message}
        type = {showToastMsg.type}
        onClose = {handleCloseToast}
      />
    </>
  )
}

export default Home