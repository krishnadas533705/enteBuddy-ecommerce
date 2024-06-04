import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { CartContext } from "../contexts/CartContext";
import { Link, useParams } from "react-router-dom";
import { SidebarContext } from "../contexts/SidebarContext";
import Rating from "../components/Rating";
import RatingBar from "../components/RatingBar";
import Reviews from "../components/Reviews";
import ReviewFormProvider from "../contexts/ReviewFormContext";
const ProductData = () => {
    const { id } = useParams();
    const { products } = useContext(ProductContext);
    const { addToCart ,handleCart } = useContext(CartContext);
    const { setIsOpen, isOpen } = useContext(SidebarContext);


    const product = products.find((item) => {
        return item._id === id;
    });
  
    if (!product) return null;

    const { title, primaryImage, description, price, category , discount} = product; 

    

    return (
       
        <div> 
            
            <div className="flex flex-col md:flex-row pt-20 md:w-screen md:h-screen items-center overflow-visible bg font">
                <div className="w-full  md:w-1/2 flex justify-center p-5 ">
                    <img
                        src={
                            "http://localhost:3000" +
                            primaryImage.path.split("server")[1]
                        }
                        className=" sm:max-w-[320px] object-cover"
                        alt="img"
                    />
                </div>
                <div className=" flex flex-col flex-1 px-5 bg-gray-50 py-5"> 
             
                    <div className="font-medium font-poppins text-[30px] pt-2 md:text-[50px]">
                        {title}
                    </div>
                    <div className="font-medium font-poppins text-[25px] md:text-[32px] text-primary uppercase ">
                        {category}
                    </div>
                 
                    <div className="py-1 font-medium font-poppins text-sm md:text-[16px]">
                        {description}
                    </div>
                    <div className="review flex  items-center my-2 ">
                        <div className="rating">
                            <Rating />
                        </div>
                        <div className="text-gray-900 font-semibold ml-2 text-sm">
                            | 30 reviews
                        </div>
                    </div>
                {/*  icons are added here */}
                   <div className="flex justify-between items-center my-5">
                    <div className="flex justify-center place-items-center">
                    <div className="text-black text-2xl font-semibold">₹{price}</div>
                    <div className="line-through mx-2 text-gray-500 text-[14px]">₹{price}</div>
                    <div className="px-2 py-0 bg-secondary text-black text-[13px] font-bold rounded-lg">{discount}%</div>
                    </div>
                    
                    <div className="text-gray-400 text-[12px] font-medium font-poppins">
                        incl. of all prices
                    </div>


                   </div>
                    
                    <button
                        onClick={()=>{handleCart();
                            addToCart(product,id);
                        }}
                        className="bg-primary text-black font-bold font-poppins p-2  w-52 flex items-center justify-center  mx-auto  rounded-full text-lg "
                    >
                        Add to cart
                    </button>
                    
                    <div className="fixed bottom-0 bg-blue-950 text-white justify-evenly p-4 w-full left-0 flex z-10">
                        <div className="w-6/12 flex items-center ">
                            <div className="max-w-[45px] rounded-full">
                                <img
                                    src={
                                        "http://localhost:3000" +
                                        primaryImage.path.split("server")[1]
                                    }
                                    alt="img w-full rounded-full"
                                />
                            </div>
                            <div className="ml-3">
                                <div>{title}</div>
                                <div> ₹ {price}</div>
                            </div>
                        </div>
                        <div 
                        onClick={()=>{handleCart();
                            addToCart(product,id);
                        }}className="w-6/12 md:w-3/12  bg-yellow-300 text-black p-2 rounded-full text-lg font-medium flex items-center justify-center">
                            Add to cart
                        </div>
                    </div>  
              
                {/* customer ratings */}
            
                   
                </div>

                
            </div>
            <div className="bg-[#ede9e7]  flex flex-col px-5 pb-20  md:min-h-screen"> 
            
             <ReviewFormProvider productId={product._id} >
                <RatingBar/> 
                <Reviews/>
             </ReviewFormProvider>
                </div>
        </div>
    ); 
};

export default ProductData;
