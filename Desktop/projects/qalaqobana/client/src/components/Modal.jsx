import React from 'react'

const Modal = ({ setSeason, setSelectedTitle, setModal}) => {

 
   
    const seasons = [
        { id: 1, title: "Spring", value: 0 },
        { id: 2, title: "Summer", value: 1.5 },
        { id: 3, title: "Autumn", value: 2.3 },
        { id: 4, title: "Winter", value: 3.0 },
      ];

  return (
    <div className='absolute top-0 right-12  mt-12 cursor-pointer flex gap-4'>
       {seasons.map((value) => (
         <div onClick={() => {
            setSeason(value.value);
            setSelectedTitle(value.title); 
            setModal(false)
          }} key={value.id} className='bg-gray-300 px-12 py-2 rounded-lg shadow-lg border-2 border-transparent duration-500 ease hover:border-white  hover:bg-yellow-500 '>
           <h2
            
          >
            {value.title}
          </h2>
            </div>
       ))}
    </div>
  )
}

export default Modal
