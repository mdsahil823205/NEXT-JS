'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
const city = ["Paris", "Tokyo", "NewYork"]
const page = () => {
  const router = useRouter()
  const cityHandler = (items) => {
    router.push(`/destination/${items}`)
  }

  return (
    <div>destination page
      <div className='text-center h-[400px] w-full flex items-center gap-10 justify-center flex-col '>
        {city.map((items, index) => (
          <div
            onClick={() => {
              cityHandler(items)
            }}
            key={index} className='text-2xl text-white bg-gray-500 flex items-center justify-center  rounded-xl w-[200px] p-6 hover:scale-101 hover:bg-gray-600 hover:text-orange-500 '>{items}</div>
        ))}
      </div>
    </div>
  )
}

export default page