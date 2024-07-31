import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd, IoMdClose, IoMdRemove } from "react-icons/io";
import { CartContext } from "../contexts/CartContext";
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item }) => {
  const { removeFromCart, addToCart, decreaseCart } = useContext(CartContext);
  
  // destructure item
  const { _id, primaryImage, productName, price, quantity,realPrice } = item;
  let [discountPrice, setDiscountPrice] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  return (
    <div className="flex gap-x-4 py-2 lg:px-5 lg:py-3 items-center pr-3 pl-2">
      <div className="div1 min-h-[150px] w-full bg-gradient-to-b from-[#FFFFFF] to-[#FEEE9F] flex items-center gap-x-4 px-3 rounded-3xl font-poppins pt-8">
        <Link to={`/product/${_id}`}>
          {/* image */}
          <img
            src={API + primaryImage.path.split("server")[1]}
            className="max-w-[75px] rounded-lg"
            alt=""
          />
        </Link>

        {/* product name and remove icon */}
        <div className="div2 w-full flex flex-col mb-2">
          <div className=" flex items-center justify-between">
            <div>
              <Link
                to={`/product/${_id}`}
                className="uppercase  text-lg  max-w-[240px] hover:underline pb-2 pl-4 font-medium"
              >
                {productName}
              </Link>

              <span className="text-red-600 ms-5">
                <del>₹ {realPrice}</del>
              </span>
            </div>
            {/* remive icon */}
            <div
              onClick={() => {
                removeFromCart(_id);
              }}
              className="text-xl cursor-pointer"
            >
              <FiTrash2 className="text-black hover:text-red-500 transition" />
            </div>
          </div>
          <div className="flex gap-x-2 mt-2  h-[36px] text-sm ">
            {/* qty */}
            <div className="flex max-w-[80px]  items-center h-full flex-1 border border-black rounded-full font-medium justify-between text-black px-1">
              {/* minus icon */}
              <div
                onClick={() => {
                  decreaseCart(_id);
                }}
                className="flex flex-1 h-full justify-center items-center "
              >
                <IoMdRemove />
              </div>
              {/* quantity */}
              <div className="px-2 flex h-full  items-center">
                {" "}
                <span>{quantity}</span>
              </div>
              {/* plus icon */}
              <div
                onClick={() => {
                  addToCart(item);
                }}
                className="flex flex-1 h-full justify-center items-center"
              >
                <IoMdAdd />
              </div>
            </div>
            {/* item price */}
            <div className="flex flex-1 justify-around items-center font-medium text-gray-400">
              ₹ {price}
            </div>
            {/* final price */}
            <div className="flex flex-1 justify-end items-center font-bold">
              ₹{`${parseFloat(price * quantity).toFixed(0)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
