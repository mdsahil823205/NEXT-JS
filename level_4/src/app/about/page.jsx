'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = async () => {
  const router = useRouter()
  await new Promise((resolve) => { setInterval(resolve, 1000) })
  return (
    <div> about page
      <br />
      <button className='bg-red-500 py-4 px-6 mt-5 ml-5 '
        onClick={() => {
          router.back()
        }}>back to previous page </button>

      <button className='bg-red-500 py-4 px-6 mt-5 ml-5 '
        onClick={() => {
          router.refresh()
        }}>refresh</button>
    </div>
  )
}

export default page