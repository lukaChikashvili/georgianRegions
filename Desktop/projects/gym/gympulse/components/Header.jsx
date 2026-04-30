"use client"
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import Image from 'next/image';
import logo from '../public/logo.png'
import { User } from 'lucide-react';
import Link from 'next/link';


const Header = () => {

    const {isAuthenticated, isLoading } = useConvexAuth();

    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div>Loading...</div>;


    const links = [
        {id: 1, link: "/", title: "მთავარი"},
        {id: 2, link: "/", title: "ჩვენს შესახებ"},
        {id: 3, link: "/", title: "ფიტნეს დარბაზისთვის"},
        {id: 4, link: "/", title: "წევრებისთვის"},
        {id: 5, link: "/blog", title: "ბლოგი"},
    ];


  return (
    <div className='w-full flex items-center justify-between px-12 py-4 border-b border-gray-300'>
    <div >
       <Link href="/"><Image width = {170}  src = {logo} alt ="logo" /></Link> 
    </div>
    <div className='flex items-center gap-8'>
    {links.map((value) => (
  <div key={value.id} className="relative group cursor-pointer">
    <Link href = {value.link}  className="font-semibold text-gray-600 transition-colors duration-300 group-hover:text-black">
      {value.title}
    </Link>

   
    <span className="absolute left-0 -bottom-1 w-0 h-[0.5] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
  </div>
))}
   </div>

    <div className='flex items-center gap-6'>
    

      
       {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode = "modal">
            <button className="group relative px-6 py-2 rounded-xl font-medium text-white 
  bg-linear-to-r from-blue-500 to-purple-600 
  hover:from-blue-600 hover:to-purple-700 
  shadow-lg hover:shadow-xl transition-all duration-300
  flex items-center gap-3 cursor-pointer">
    
    <User className="w-4 h-4 group-hover:scale-110 transition" />
    რეგისტრაცია
  </button>
            </SignInButton>

            
          </>
       )}
  
       {isAuthenticated && !isLoading && (
          <>
           <h1 className='text-purple-600 font-bold'>გამარჯობა, {user?.firstName}</h1>
           <UserButton afterSwitchSessionUrl='/'/>
          </>
         
       )}
    </div>


 </div>
  )
}

export default Header
