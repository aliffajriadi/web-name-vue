import React from 'react'
import { FileWarningIcon } from 'lucide-react' 
const ModalHP = () => {
  return (
    <div className='hidden md:block fixed top-40 left-4'>
        <div className='bg-primary text-secondary px-6 flex items-center space-x-2'><FileWarningIcon/> OPEN IN MOBILE / HANDPHONE <br />FOR BEST UI EXPERIENCE</div>
    </div>
  )
}

export default ModalHP