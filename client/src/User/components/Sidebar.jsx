
import React, { useContext, useEffect,useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { IoMdArrowForward, IoMdTrash } from "react-icons/io";
import { CartContext } from "../contexts/CartContext";
import CartItem from "./CartItem";
import { FiTrash2 } from "react-icons/fi";
import { userContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const { isOpen, handleClose } = useContext(SidebarContext);
    const {
      cart,
      clearCart,
      itemAmount,
      totalPrice,
      setDiscountPrice,
      discountPrice,
      setCouponId,
    } = useContext(CartContext);
  
    const { userId } = useContext(userContext);
  
    const [isChecked,setIsChecked] =useState(false)
    // useEffect(() => {
    //     const handleBodyScroll = () => {
    //       console.log("working")
    //         if (isOpen) {
    //             document.body.style.overflow = "hidden"; // Disable scrolling on the body
    //         } else {
    //             document.body.style.overflow = ""; // Enable scrolling on the body
    //         }

    //     };

    //     // Add event listener for body scroll
    //     document.body.addEventListener("scroll", handleBodyScroll);
       
    //     // Clean up function to remove event listener
    //     return () => {
    //         document.body.removeEventListener("scroll", handleBodyScroll);
    //     };
    // }, [isOpen]);

    const handleCheckboxChange =()=>{
      setIsChecked(!isChecked);
    }


    ////applying coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState(null);
  const applyCoupon = async () => {
    console.log("Apply coupon function working...");
    if (couponCode) {
      console.log("Coupon checking....");
      const response = await fetch(
        `/api/user/checkCoupon/${userId}/${couponCode}`,
        {
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.isAvailable) {
        const discount = result.discount;
        if (discount == 100) {
          let quantity = cart.reduce(
            (quantity, item) => item.quantity + quantity,
            0
          );
          quantity = Math.floor(quantity / 2);
          const allPrices = cart
            .map((item) => item.price)
            .sort((a, b) => a - b)
            .slice(0, quantity);
          const discountPrice = allPrices.reduce(
            (acc, price) => price + acc,
            0
          );
          const newPrice = totalPrice - discountPrice;
          setDiscountPrice(newPrice);
          localStorage.setItem("enteBuddyCartPrice", newPrice);
        } else {
          const price = (totalPrice * discount) / 100;
          setDiscountPrice(price);
          localStorage.setItem("enteBuddyCartPrice", price);
        }
        setCouponId(result.couponId);
        localStorage.setItem("enteBuddyCouponId",result.couponId)
      } else {
        setCouponError(result.msg);
      }
    } else {
      setCouponError("Please enter coupon code.");
    }
  };


    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg z-10"
                    onClick={handleClose} // Close sidebar when clicking on the background
                ></div>
            )}


            <div
                className={`${
                    isOpen ? "right-0" : "-right-full"
                } w-full h-full bg-white fixed z-20 top-0  md:w-[35vh] lg:w-4/12 transition-all 
      duration-300  lg:px-[15px] `}
            >
                {" "}
                <div className="uppercase bg-yellow-400  flex justify-center p-1 font-medium">
                    express and discreet delivery
                </div>
                <div className="flex justify-between py-2 border-b-2 items-center border-b-gray-100 px-4">
                    <div className=" font-medium uppercase">
                        My cart ({itemAmount})
                    </div>

                    <div
                        onClick={handleClose}
                        className="cursor-pointer w-8 h-8 flex justify-center items-center"
                    >
                        <IoMdArrowForward className="text-2xl" />
                    </div>
                </div>
                {/* this div is for displaying the cart items  */}
                <div className="flex flex-col h-1/2   lg:h-[400px] overflow-y-auto overflow-x-hidden border-b px-4">
                    {cart &&
                        cart.map((item) => (
                            <div key={item._id}>
                                <CartItem item={item} />
                            </div>
                        ))}
                    {/* <div className="flex justify-end bg-gray-50  py-1">
                              <div className=" font-poppins font-medium pr-4 ">
                                clear cart  
                              </div>
                            <div
                                  onClick={() => {
                                      clearCart();
                                  }}
                                  className="cursor-pointer bg  w-10 h-10   text-xl rounded-full border border-gray-200"
                              >
                                  <FiTrash2 />
                              </div>

                            </div> */}
                </div>
                <div className="flex flex-cols h-1/2 mb-2 px-4 bg-[#faf9f6ca]">
                  
                    <div
                        className={` ${
                            itemAmount === 0 ? "hidden" : "block"
                        }  w-full `}
                    >
                        {/* total */}
                        <div className="text-center underline text-sm font-poppins py-2 text-gray-500">
                            100 days warranty and discreet shipping{" "}
                        </div>
                        <div>
                            <div
                                className={`mt-5 ml-2 font-poppins flex justify-between`}
                            >
                                <div>
                                    <div className="font-medium">Mrp</div>
                                    <span> (incl taxes ) </span>
                                </div>

                                <div className="font-medium">
                                    ₹{discountPrice > 0 ? discountPrice : totalPrice}
                                </div>
                            </div>
                          
                            <div>
                             <div className="flex justify-center items-center font-poppins">

                             <label htmlFor="termsCheckbox" className="text-[14px]  my-3  sm:my-5">
                                  You are 21 and agree to the Terms & Conditions
                                </label>

                                <input
                                    type="checkbox" 
                                    id="termsCheckbox"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 ml-6 my-5 "
                                />


                             </div>

                            <Link to="/checkout">
                                <button className={`w-full ${isChecked ? "bg-secondary":"bg-slate-400" } text-white py-3 rounded-full  font-poppins  `} disabled={!isChecked}>Checkout</button>
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
