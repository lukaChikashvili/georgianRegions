"use client"
import { SignInButton, UserButton } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';


const Header = () => {

    const {isAuthenticated, isLoading } = useConvexAuth();

    const links = [
        {id: 1, link: "/learn", title: "მთავარი"},
        {id: 2, link: "/", title: "ჩვენს შესახებ"},
        {id: 3, link: "/", title: "ფიტნეს დარბაზისთვის"},
        {id: 4, link: "/", title: "წევრებისთვის"},
        {id: 5, link: "/blog", title: "ბლოგი"},
    ];


  return (
    <div className='w-full flex items-center justify-between px-12 py-4 border-b border-gray-300'>
    <div >
        logo
    </div>
    <div className='flex items-center gap-12'>
       {links.map((value) => (
        <div key={value.id}>
            <h2>{value.title}</h2>
        </div>
       ))}
   </div>

    <div className='flex items-center gap-6'>
    

      
       {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode = "modal">
               <button className='Btn'>Start Free</button>
            </SignInButton>

            
          </>
       )}
  
       {isAuthenticated && !isLoading && (
          <UserButton afterSwitchSessionUrl='/'/>
       )}
    </div>


 </div>
  )
}

export default Header
