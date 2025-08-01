import React, { useState } from 'react'
import Modal from './Modal';

const Header = ({ setSeason }) => {
   
     const [modal, setModal] = useState(false);
     const [selectedTitle, setSelectedTitle] = useState(''); 

  return (
    <div className='w-full flex items-center justify-between px-12 py-4'>

        <div>
            
        </div>

       <div className=''>
         <button className='text-xl cursor-pointer text-white font-bold' onClick={() => setModal(!modal)} >{selectedTitle ? selectedTitle : "Seasons"}</button>

       </div>

       {modal && <Modal setModal = {setModal} setSelectedTitle={setSelectedTitle}  setSeason={setSeason} />}
    </div>
  )
}

export default Header
