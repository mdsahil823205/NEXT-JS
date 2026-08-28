'use client'
import React, { useState } from 'react'

const page = () => {
    const [name, setName] = useState("sahil")
    console.log(name);

    return (
        <div className='text-2xl font-bold'>
            <h1>
                About
            </h1>
            <h1>{name}</h1>
        </div>
    )
}

export default page