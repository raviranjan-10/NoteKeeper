import React, { useState } from 'react'
import TagInput from '../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const AddEditNotes = ({noteData, type, getAllNotes, onClose, showToastMessage}) => {
    console.log(showToastMessage);
    //handling note data states
    const [title,setTitle] = useState(noteData?.title || "");
    const [content,setContent] = useState(noteData?.content || "");
    const [tags,setTags] = useState(noteData?.tags || []);

    //error state
    const [error, setError] = useState(null);

    //Add Note
    const addNewNote = async()=>{
        try{
            const response = await axiosInstance.post("/add-note",{
                title,
                content,
                tags
            });
            if(response.data && response.data.note){
                showToastMessage("Note added successfully");
                getAllNotes();
                onClose();
            }
        } catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };
    
    //editNote
    const editNote = async() => {
        const noteId = noteData._id;
        try{
            const response = await axiosInstance.put("/edit-note/"+noteId,{
                title,
                content,
                tags,
            });
            if(response.data && response.data.note){
                showToastMessage("Note updated successfully");
                getAllNotes();
                onClose();
            }
        } catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    //note input error handling
    const handleAddNote = ()=>{
        if(!title){
            setError("Please enter a Title.");
            return;
        }

        if(!content){
            setError("Please add content.");
            return;
        }

        setError("");
        if(type==="edit"){
             editNote();
        } else {
              addNewNote();
             
        }

    };

    return (
        <div className='relative'>

            {/* Modal Window close button */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-300" onClick={onClose}> <MdClose className='text-xl text-slate-400'/></button>
            <div className='flex flex-col gap-2'>
                {/* title */}
                <label className='input-label'>TITLE</label>
                <input
                    type='text'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Go To Gym at 5PM'
                    value={title}
                    onChange={({target})=>setTitle(target.value)}
                />
            </div>

            {/* content */}
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>CONTENT</label>
                <textarea
                    type='text'
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='Content'
                    rows={10}
                    value={content}
                    onChange={({target})=>setContent(target.value)}
                />
            </div>

            {/* tags */}
            <div className='mt-3'>
                <label className='input-label'>TAGS</label>
                <TagInput tags={tags} setTags={setTags}/>
            </div>

            {/* Display error message */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}


            {/* Add New Note Button */}
            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{(type==="edit") ? "UPDATE" : "ADD"}</button>
        </div>
    )
}

export default AddEditNotes