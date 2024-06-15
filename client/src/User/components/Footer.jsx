import React from 'react'
import logo from '../img/logo.png'
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

const Footer = () => { 
  const [aboutModal,setAboutModal] = useState(false)
  const [contactModal,setContactModal] = useState(false)
  return ( 
    <>
    <div className='px-7 py-5 md:px-40 bg-hero2 bg-tertiary bg-contain text-secondary font-poppins font-medium'>
      <div className='flex justify-between '>
        <div className='flex flex-col uppercase text-[8px] py-5 md:text-lg'>
          <Link to="/privacypolicy"> <div className='mb-[10px]'>privacy policy</div></Link>
          <Link to='/termsandconditions'> <div className='mb-[10px]'>terms and conditions</div></Link>
           <div onClick={()=>{setAboutModal(!aboutModal) } } className='cursor-pointer mb-[10px]'>About us </div>
           <Link to="/shippingPolicy">   <div className='mb-2 cursor-pointer'>Shipping and Delivery</div> </Link> 
        </div>
        <div className="'flex flex-col w-80 md:w-60 justify-center items-center">
          <div>
          <img src={logo} alt='logo' className=''/>
          </div>
          
          <div className='flex justify-between  text-primary px-16 py-5 '>
             <FaFacebookF/>
            <FaInstagram className='mx-1'/>
            <FaTwitter/>

          </div>
        </div>
         <div className='flex flex-col uppercase text-[8px] py-6 md:text-lg font-poppins font-medium'>
          <div className='mb-3 cursor-pointer'> Track your order</div>
          
          <div onClick={()=>{setContactModal(!contactModal) } } className='cursor-pointer mb-3'> Contact us</div>
        <Link to="/refundPolicyAndCancellation">   <div className='mb-2 cursor-pointer'>Cancellation and refund policy</div> </Link> 
        
         </div>
      </div>


    </div> 
    { aboutModal && <AboutUs onClose={()=>{setAboutModal(false)}}/> } 

    { contactModal && <ContactUs onClose={()=>{setContactModal(false)}}/> } 
    </>
  )
}

export default Footer