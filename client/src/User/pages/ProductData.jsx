import React, { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { CartContext } from "../contexts/CartContext";
import { Link, useParams } from "react-router-dom";
import { SidebarContext } from "../contexts/SidebarContext";
import Rating from "../components/Rating";
import RatingBar from "../components/RatingBar";
import Reviews from "../components/Reviews";
import ReviewFormProvider from "../contexts/ReviewFormContext";
import Shimmer from "../components/Shimmer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import "swiper/css/navigation";

const ProductData = () => {
  const { id } = useParams();
  const { products } = useContext(ProductContext);
  const { addToCart, handleCart } = useContext(CartContext);
  const { setIsOpen, isOpen } = useContext(SidebarContext);
  const [revCount, setRevCount] = useState(0);
  const API = import.meta.env.VITE_API_URL;
  const product = products.find((item) => {
    return item._id === id;
  });

  if (!product || product.length === 0) return <Shimmer />;

  const handleReviewCount = (value) => {
    setRevCount(value);
  };
  const {
    title,
    primaryImage,
    description,
    price,
    category,
    discount,
    secondaryImages,
    productFeatures,
    serviceFeatures,
  } = product;

  return (
    <div>
      <div className="flex flex-col md:flex-row pt-[65px] md:pb-1 md:w-screen md:h-screen  items-center overflow-visible bg font">
        <div className="w-full md:w-1/2 md:h-5/6 flex justify-center text-center">
          <Swiper
            modules={[Navigation, Pagination]} // Use pagination module
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {[primaryImage, ...secondaryImages].map((image) => (
              <SwiperSlide key={image.name + Math.random()} style={{display:'flex', justifyContent:'center'}}>
                <img
                  src={API + image.path.split("server")[1]}
                  className="w-full"
                  alt="img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className=" flex flex-col flex-1 px-5 md:px-20 bg-gray-50 py-5 h-full w-full md:justify-center md:items-center">
          <div className="font-medium font-poppins text-[30px] pt-2 md:text-[50px]">
            {title}
          </div>
          <div className="font-medium font-poppins text-[25px] md:text-[32px] text-primary uppercase ">
            {category}
          </div>

          <div className="py-1 font-medium font-poppins text-sm md:text-[16px]">
            {description}
          </div>
          <div className="py-1 font-poppins text-sm md:text-[16px] flex justify-center mt-3 mb-1 w-full gap-1 md:gap-3">
            {productFeatures &&
              productFeatures.map((feature) => (
                <div className="flex flex-col items-center" key={feature._id}>
                  <img
                    src={API + feature.icon.split("server")[1]}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="text-xs flex text-center mt-2">
                    <h1 className="w-20">{feature.description}</h1>
                  </div>
                </div>
              ))}
          </div>
          <div className="review flex  items-center my-2 ">
            <div className="rating">
              <Rating />
            </div>
            <div className="text-gray-900 font-semibold ml-2 text-sm">
              | {revCount} reviews
            </div>
          </div>
          {/*  icons are added here */}
          <div className=" w-full flex justify-between items-center my-5 border-b-2">
            <div className="flex justify-center place-items-center">
              <div className="text-black text-2xl font-semibold">
                ₹ {Math.floor(price - (discount / 100) * price)}
              </div>
              <div className="line-through mx-2 text-gray-500 text-[14px]">
                ₹{price}
              </div>
              <div className="px-2 py-0 bg-secondary text-black text-[13px] font-bold rounded-lg">
                {discount}%
              </div>
            </div>

            <div className="text-gray-400 text-[12px] font-medium font-poppins">
              incl. of all prices
            </div>
          </div>

          <button
            onClick={() => {
              handleCart();
              addToCart(product, id);
            }}
            className=" hover:bg-blue-950 hover:text-white bg-primary text-black focus:bg-primary focus:text-black font-medium font-poppins p-2  w-52 flex items-center justify-center  mx-auto  rounded-full text-lg "
          >
            Add to cart
          </button>

          <div className="pb-1 pt-4 font-poppins text-sm md:text-[16px] mt-5 mb-1 grid grid-cols-2 gap-4 w-full border-t-2 ">
            {serviceFeatures &&
              serviceFeatures.map((feature) => (
                <div
                  className="flex items-center justify-around"
                  key={feature._id}
                >
                  <div className="flex">
                    <img
                      src={API + feature.icon.split("server")[1]}
                      alt=""
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="text-xs flex text-center mt-2">
                      <h1 className="w-20">{feature.description}</h1>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="fixed bottom-0 text-white justify-evenly p-4 w-full left-0 flex z-10" style={{backgroundColor:'#3A2D3F'}}>
            <div className="w-6/12 flex items-center ">
              <div className="max-w-[45px] rounded-full">
                <img
                  src={API + primaryImage.path.split("server")[1]}
                  alt="img w-full rounded-full"
                />
              </div>
              <div className="ml-3">
                <div>{title}</div>
                <div> ₹ {Math.floor(price - (discount / 100) * price)}</div>
              </div>
            </div>
            <div
              onClick={() => {
                handleCart();
                addToCart(product, id);
              }}
              className="hover:bg-blue-950 hover:text-white cursor-pointer w-6/12 md:w-3/12  bg-primary text-black font-medium font-poppins p-2 rounded-full text-lg flex items-center justify-center"
            >
              Add to cart
            </div>
          </div>

          {/* customer ratings */}
        </div>
      </div>
      <div className="bg-[#ede9e7]  flex flex-col px-5 pb-20  md:min-h-screen">
        <ReviewFormProvider productId={product._id}>
          <RatingBar />
          <Reviews handleReviewCount={handleReviewCount} />
        </ReviewFormProvider>
      </div>
    </div>
  );
};

export default ProductData;
