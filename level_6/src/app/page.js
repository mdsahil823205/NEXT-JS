import React from 'react'
// 1. SSR (SERVER SIDE RENDERING)
// const page = async () => {
//   const response = await fetch("http://localhost:3000/api/user", {
//     cache: 'no-store'
//   })
//   const resData = await response.json();
//   console.log(resData)

const page = async () => {
  // 1. SSR (SERVER SIDE RENDERING)
  // const page = async () => {
  //   const response = await fetch("http://localhost:3000/api/user", {
  //     cache: 'no-store'
  //   })
  //   const resData = await response.json();
  //   console.log(resData)

  // 2. SSG (STATIC SITE GENERATION)
  // const response = await fetch("http://localhost:3000/api/user", {
  //   cache: 'force-cache'
  // })
  // const resData = await response.json();
  // console.log(resData)

  // 3. ISR (INCREMENTAL STATIC REGENERATION)
  // const response = await fetch("http://localhost:3000/api/user", {
  //   next: { revalidate: 5 } // yaha pe page har 5 second page relaod hoga hai 
  // })
  // const resData = await response.json();
  // console.log(resData)

  return (
    <div>page</div>
  )
}

export default page