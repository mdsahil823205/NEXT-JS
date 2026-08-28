'use client'
import React, { useEffect } from 'react'

const page = () => {
    const handleApi = async () => {
        const res = await fetch("/api/user")
        const resData =await res.json()
        console.log("client", resData)
    }
    useEffect(() => {
        handleApi()
    }, [])

    return (
        <div>page</div>
    )
}

export default page