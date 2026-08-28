import React from 'react'
import { Poppins } from 'next/font/google'
import { Roboto } from 'next/font/google'
const PoppinsFont = Poppins({
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
})
const robottoFont = Roboto({
  subsets: ['latin'],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
})
const page = () => {
  return (
    <div>caption optimaization
      <br />
      <br />
      <br />
      <div className={robottoFont.className + " text-4xl "}>robotto font</div>
      <br />
      <div className={PoppinsFont.className + " text-4xl "}>poppins font</div>
    </div>
  )
}

export default page