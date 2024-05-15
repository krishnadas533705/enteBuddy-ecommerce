import React from 'react'
import Rating from './Rating';


const Reviews = () => { 
  
  return (
    <div>
 <ul className="">
  <li className="py-5 text-left border px-4 m-2 font-poppins">
    <div className="flex items-start">
      <div className="">
      <Rating/>
        <p className="mt-5 text-base text-gray-900">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro blanditiis sapiente ab dolores, ad dignissimos perspiciatis.</p>
        <p className="mt-5 text-sm font-bold text-gray-900">Adithya</p>
        <p className="mt-1 text-sm text-gray-600">March 01, 2022</p>
      </div>
    </div>
  </li>
</ul>
    </div>
  )
}

export default Reviews