'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter()
  return (
    <div>
      <ul>
        <Link href={"/"}><li className='bg-yellow-300'>Home</li></Link>
        <Link href={"/about"}><li className='bg-red-400'>about</li></Link>
        <Link href={"/contact"}> <li className='bg-blue-300'>contact</li></Link>
        <Link href={"https://www.google.com/?zx=1787647816545"}> <li className='bg-green-400'>google</li></Link>
      </ul>

      <button className='bg-blue-600 py-4 px-6 mt-20 ml-2.5 rounded-xl hover:scale-1.1 cursor-pointer '
      onClick={() => {
        router.push("https://www.google.com/?zx=1787647816545")
      }}> google search </button>

      <button className='bg-blue-600 py-4 px-6 mt-20 ml-2.5 rounded-xl hover:scale-1.1 cursor-pointer '
      onClick={() => {
        router.push("/contact")
      }}> contact page  </button>

        <button className='bg-blue-600 py-4 px-6 mt-20 ml-2.5 rounded-xl hover:scale-1.1 cursor-pointer '
      onClick={() => {
        router.push("/about")
      }}> about page  </button>
    </div>
  )
}

export default page