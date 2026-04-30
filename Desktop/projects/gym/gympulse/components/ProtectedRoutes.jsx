import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation';
import React from 'react'

const ProtectedRoutes = ({ children }) => {
 
    const {isAuthenticated, isLoading } = useConvexAuth();

    if(isLoading) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <span className="loader"></span>
            </div>
        )
    }

    if(!isAuthenticated) {
        return redirect("/");

    }

  return (
    <div>
        {children}
    </div>
  )
}

export default ProtectedRoutes