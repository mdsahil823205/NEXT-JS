
const page = async({params}) => {
  
    const {username}=await params
    console.log(username)

  return (
    <div>profile username page :{username}</div>
  )
}

export default page