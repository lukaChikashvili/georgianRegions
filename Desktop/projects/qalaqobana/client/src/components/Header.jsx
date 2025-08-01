import React, { useState } from 'react'
import Modal from './Modal';

const Header = () => {
   
     const [modal, setModal] = useState(false); 

  return (
    <div className='w-full flex items-center justify-between px-12 py-4'>

        <div>
            
        </div>

       <div className=''>
         <button className='text-xl cursor-pointer' onClick={() => setModal(!modal)} >Seasons</button>

       </div>

       {modal && <Modal />}
    </div>
  )
}

export default Header
