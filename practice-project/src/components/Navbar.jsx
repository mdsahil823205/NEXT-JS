'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const path = usePathname()
    return (
        <nav className='h-[70px] bg-white text-black flex justify-between'>
            <h2 className='font-bold text-2xl h-full flex items-center text-gray-900 w-full ml-3'>Travel Agent</h2>
            <ul className='h-full flex items-center justify-end w-full gap-8 mr-16 uppercase'>
                <Link href={"/"}><li className={`text-xl hover:text-orange-500 transition-all duration-300 ${path === '/' ? 'text-orange-500' : ''}`}>home</li> </Link>
                <Link href={'/destination'}><li className={`text-xl hover:text-orange-500 transition-all duration-300 ${path === '/destination' ? 'text-orange-500' : ''}`}>destination</li> </Link>
                <Link href={'/contact'}><li className={`text-xl hover:text-orange-500 transition-all duration-300 ${path === '/contact' ? 'text-orange-500' : ''}`}>contact</li> </Link>
            </ul>
        </nav>
    )
}

export default Navbar