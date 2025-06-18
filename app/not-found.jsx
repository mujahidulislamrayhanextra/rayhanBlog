import Link from 'next/link'
import React from 'react'

const NotFound= () => {
  return (
    <div className='container h-screen flex flex-col gap-5 justify-center items-center'>
     <h2> Page Not Found || 404 </h2>
      <Link href="/">
      Return to Home
      </Link>
    </div>
  )
}

export default NotFound
