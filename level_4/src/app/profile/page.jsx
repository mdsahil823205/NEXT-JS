import React from 'react'
import Image from 'next/image'
import prof from "../../../public/react.jpg"
const page = () => {
    return (
        <div>
            <h1>image optimization</h1>
            <Image src={prof} alt="react" width={500} height={500} />
            <br />
            <Image src={"/react.jpg"} alt="react" width={500} height={500} />
        </div>
    )
}

export default page