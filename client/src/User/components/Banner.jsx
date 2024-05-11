import React from 'react'
import SextoyImg from '../img/Sex-toys-4-scaled.jpg'

const Banner = () => {
  return (
    <div className='w-full p-4 lg:px-16 lg:pt-7  '>
        <img src={SextoyImg} alt='img' className='rounded-3xl lg:max-h-[400px] w-full object-fit'/>

    </div>
  )
}

export default Banner