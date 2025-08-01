import React from 'react'

const Modal = () => {

   
    const seasons = [
        {
            id: 1,
            title: "Spring",

        },

        {
            id: 2,
            title: "Summer",

        },

        {
            id: 3,
            title: "Autumn",

        },

        {
            id: 4,
            title: "Winter",

        },
    ]

  return (
    <div className='absolute top-0 right-12 bg-red-500 mt-12 cursor-pointer'>
       {seasons.map((value) => (
         <div key={value.id}>
            <h2>{value.title}</h2>
            </div>
       ))}
    </div>
  )
}

export default Modal
