import React, { useContext, useState } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import { IoMdArrowForward, IoMdTrash } from "react-icons/io";
import { CartContext } from "../contexts/CartContext";
import CartItem from "./CartItem";
import { FiTrash2 } from "react-icons/fi";
import { userContext } from "../contexts/UserContext";

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
          {cart &&
            cart.map((item) => (
              <div key={item._id}>
                <CartItem item={item} />
              </div>
            ))}
        </div>
        {/* coupon apply area */}
        <div className="flex flex-col bg-gray-200 border mt-4 rounded-md font-poppins   ">
          <label className="flex justify-center items-center py-2">
            Coupon code
          </label>
          <input
            className=" border border-gray-100 px-4 py-2"
            type="text"
            name="coupon-code"
            placeholder="Disc30"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>
        <div className="mt-4 mb-8">
          <button
            type="button"
            onClick={() => applyCoupon()}
            className=" w-full rounded-md bg-slate-700 px-6 py-3 font-medium text-white "
          >
            Apply
          </button>
          {couponError && (
            <p className={`text-center text-sm text-red-500`}>{couponError}</p>
          )}
        </div>
        <div className="flex flex-cols py-4 mb-2 px-4   ">
          <div
            className={` ${
              itemAmount === 0 ? "hidden" : "block"
            } flex justify-between py-2 items-center w-full `}
          >
            {/* total */}
            <div className={` font-bold uppercase ml-2`}>
              {console.log("Discount price : ", discountPrice)}
              <span>Total :</span>₹
              {discountPrice > 0 ? discountPrice : totalPrice}
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
