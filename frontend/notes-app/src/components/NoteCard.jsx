import React from 'react'
import { MdOutlinePushPin } from "react-icons/md"
import moment from "moment";
import { MdCreate, MdDelete } from 'react-icons/md'
const NoteCard = ({ title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote }) => {

    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
            <div className='flex items-center justify-between'>
                <div className=''>

                    {/* title */}
                    <h6 className='text-sm font-medium'>{title}</h6>

                    {/* date */}
                    <span className='text-xs text-slate-500 '>{moment(date).format("Do MMM YYYY")}</span>
                </div>

                {/* pin icon */}
                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-500'}`} onClick={onPinNote} />
            </div>

            {/* content */}
            <p className='text-xs text-slate-600 mt-2' >{content?.slice(0, 60)}</p>

            <div className='flex justify-between items-center mt-2'>
                {/* tags */}
                <div className='text-xs text-slate-500'>{tags.map((item)=>(`# ${item}`))}</div>
                <div className='flex items-center gap-2'>
                    {/* edit icon */}
                    <MdCreate
                        className='icon-btn hover:text-green-600'
                        onClick={onEdit}
                    />
                    {/* delete note icon */}
                    <MdDelete
                        className='icon-btn hover:text-red-500'
                        onClick={onDelete}
                    />
                </div>

            </div>
        </div>
    )
}

export default NoteCard