import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { FaShoppingCart ,FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import LoginModel from "./LoginModel";
import peakpx from '../img/peakpx.jpg'
import logo from '../img/logo.png';
import { userContext } from "../contexts/UserContext";
import { Toaster,toast } from "react-hot-toast";

const Header = () => {
  const { itemAmount } = useContext(CartContext);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollYt);
  const [visible, setVisible] = useState(true);
  const [showModal,setShowModal] = useState(false) 
  const [dropDown, setDropDown] = useState(false)
  const {userId} = useContext(userContext) 
  

 const handleCart=()=>{
  if(userId){
    setIsOpen((prev)=>!prev)
  }
    else 
    { 
      toast.error("Please log in to order")
      setShowModal(true)
    }
  
 }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const visible = prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
      
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const toggleMenu =()=>{
    setDropDown(!dropDown)
  } 

  return (
    <div>
      <Toaster toastOptions={{duration:1000}}/>
      <div
        className={`navbar bg-hero bg-cover z-10 fixed transition-transform duration-300 ${
          visible ? "" : "transform -translate-y-full "
        } `} 
      >
        <div className="navbar-start">
          <div className="dropdown ">
            <div
              tabIndex={0}
              role="button"
              className=" btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor" 
                
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
             
              <li className="border-b border-gray-300">
                <Link>Contact us</Link>
              </li>
              <li className="border-b border-gray-300">
                <Link>About us</Link>
              </li>
              <li className="border-b border-gray-300">
                <Link>Track your order</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link to="/" className="btn btn-ghost text-xl ">
            <img src={logo} className="w-15 h-10"/>
          </Link>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle relative"
            >
              <div className="w-8 rounded-full ">
                <FaUser  onClick={()=>{toggleMenu()}} className="ml-2 text-xl text-yellow-400"/> 
                {userId && (<div className="bg-green-500  w-3 h-3 rounded-full absolute top-2 right-2"></div>)}
              </div>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 transition-transform duration-300`} 
              style = {{display :dropDown ? 'block' : 'none' }}
            > 
           
               <li>
                <Link className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
            
              </li>
              <li>  {userId ? <button>Log out</button>: <button onClick={()=>{setShowModal(true) ; setDropDown(!dropDown)}}>login</button> }
               
               

              </li>
            </ul>
          </div>

          <button
            className="btn btn-ghost btn-circle"
            onClick={handleCart}
          >
            <div className="indicator">
              <FaShoppingCart className="text-2xl text-yellow-400" />
              <span className="badge badge-sm badge-secondary bg-red-500  indicator-item">
                {itemAmount}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* cart icon */}
      {/* <div onClick={()=>{
        setIsOpen(!isOpen)
      }}>
        
      </div> */} 
        { showModal && <LoginModel onClose={()=>{setShowModal(false)}}/> } 

    </div> 

  );
};

export default Header;
