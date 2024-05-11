import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Product = ({ product }) => {
  const { _id, primaryImage, category, price, title, description ,discount} = product;
  const { addToCart } = useContext(CartContext);
  return (
    <div className="w-full  md:h-[600px] bg-gradient-to-b from-[#d8e3cb] to-[#c4e5da] rounded-2xl shadow-xl mb-4 flex flex-col justify-between">
      <div>
        <Link to={`/product/${_id}`}>
          <div className="h-[190px] md:h-[300px] w-full object-cover  bg-white rounded-t-2xl relative">
            <img
              className=" w-full h-full  rounded-t-2xl"
              src={'http://localhost:3000' + primaryImage.path.split('server')[1]}
              alt="null"
            />
            <div className="absolute bg-red-500 px-2 py-1 rounded-2xl text-white text-xs font-medium  font-poppins right-2 top-2">{discount} % off</div> 
          </div>
        </Link>
        <div className=" p-2">
          <div className="font-semibold font-poppins text-[23px] text-green-800 text-center ">
            {title}
          </div>
          <div className="font-medium text-sm text-yellow-900 text-center leading-none font-poppins">
            {category}
          </div>

          <div className="review flex md:justify-center items-center my-6 ">
            <div className="rating ">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-pink-400 w-3 h-3 "
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-pink-400 w-3 h-3"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-pink-400 w-3 h-3"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-pink-400 w-3 h-3"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-pink-400 w-3 h-3"
              />
            </div>
            <span  className="text-blaxk font-poppins  font-medium  ml-2 text-xs">(30 reviews)</span>
          </div>
          <div
            className="h-[60px] text-[10px] overflow-hidden text-black font-poppins font-semibold text-center px-1 my-6"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              // Added to ensure compatibility with non-WebKit browsers
            }}
          >
            {description}
          </div>
          <div className="text-sm font-bold mt-2 text-center font-poppins my-3">
            <span className="text-gray-400 line-through mr-2 ">₹ {price}</span>{" "}
            <span>₹ {price} </span>
          </div>

          <Link to="/">
            <button
              onClick={() => {
                addToCart(product, _id);
              }}
              className="mt-2 border border- p-2 bg-blue-900 text-white w-full rounded-3xl ml-0 font-poppins"
            >
              Shop now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
