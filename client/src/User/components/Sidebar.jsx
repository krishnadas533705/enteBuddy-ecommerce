import React, { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { IoMdArrowForward, IoMdTrash } from "react-icons/io";
import { CartContext } from "../contexts/CartContext";
import CartItem from "./CartItem";
import { FiTrash2 } from "react-icons/fi";

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const { cart, clearCart, itemAmount, totalPrice } = useContext(CartContext);
  
  return (
    <div>
      <div
        className={`${
          isOpen ? "right-0" : "-right-full"
        } w-full h-full bg-white fixed z-20 top-0  md:w-[35vh] lg:w-4/12 transition-all 
      duration-300  lg:px-[15px]`}
      >
        {" "}
        <div className="uppercase bg-yellow-400  flex justify-center p-1 font-medium">
          express and discreet delivery
        </div>
        <div className="flex justify-between py-2 border-b-2 items-center border-b-gray-100 px-4">
          <div className=" font-medium uppercase">My cart ({itemAmount})</div>

          <div
            onClick={handleClose}
            className="cursor-pointer w-8 h-8 flex justify-center items-center"
          >
            <IoMdArrowForward className="text-2xl" />
          </div>
        </div>
        {/* this div is for displaying the cart items  */}
        <div className="flex flex-col  h-[520px] lg:h-[550px] overflow-y-auto overflow-x-hidden border-b px-4">
          {cart && cart.map((item) => (
            <div key={item._id}>
              <CartItem item={item} />
            </div>
          ))}
        </div>
        <div className="flex flex-cols py-4 mb-2 px-4   ">
          <div
            className={` ${
              itemAmount === 0 ? "hidden" : "block"
            } flex justify-between py-2 items-center w-full `}
          >
            {/* total */}
            <div className={` font-bold uppercase ml-2`}>
              <span>Total :</span>₹{parseFloat(totalPrice).toFixed(2)}
            </div>
            {/* clear cart icon */}
            <div
              onClick={() => {
                clearCart();
              }}
              className="cursor-pointer bg  w-10 h-10 flex items-center justify-center  text-xl rounded-full border border-gray-200"
            >
              <FiTrash2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
