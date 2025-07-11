import React from 'react'
import { Instagram, Github, LinkedinIcon } from 'lucide-react'
import { igdata, lkdata, gitdata, emaildata } from "@/lib/data";
import Link from 'next/link';

const Footer = () => {
  return (
    <div className='flex justify-between my-5 px-6'>
        <div className='flex space-x-3'>
            <Link href={igdata}><Instagram /></Link>
            <Link href={gitdata}><Github/></Link>
            <Link href={lkdata}><LinkedinIcon /></Link>
        </div>
        alif f. 2025
    </div>
  )
}

export default Footer