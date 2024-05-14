import React, { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { CartContext } from "../contexts/CartContext";
import { Link, useParams } from "react-router-dom";
import { SidebarContext } from "../contexts/SidebarContext";
import Rating from "../components/Rating";
import RatingBar from "../components/RatingBar";

const ProductData = () => {
    const { id } = useParams();
    const { products } = useContext(ProductContext);
    const { addToCart } = useContext(CartContext);
    const { setIsOpen, isOpen } = useContext(SidebarContext);

    const product = products.find((item) => {
        return item._id === id;
    });
    console.log(product);
    if (!product) return null;

    const { title, primaryImage, description, price, category } = product;
    const word = title.split(" ")[0];

    return (
        <div>
            <div className="flex flex-col md:flex-row pt-20  overflow-visible bg font">
                <div className="w-full md:h-full md:flex-1 flex justify-center p-5 ">
                    <img
                        src={
                            "http://localhost:3000" +
                            primaryImage.path.split("server")[1]
                        }
                        className=" sm:max-w-[320px]"
                        alt="img"
                    />
                </div>
                <div className=" flex flex-col flex-1 px-5 bg-gray-50 py-5">
                    <div className="font-bold font-poppins text-[20px] py-3">
                        {title}
                    </div>
                    <div className="font-medium font-poppins text-[15px] text-green-500 uppercase">
                        {category}
                    </div>
                    <div className="review flex  items-center my-2 ">
                        <div className="rating">
                            <Rating />
                        </div>
                        <div className="text-gray-900 ml-2 text-lg">
                            | 30 reviews
                        </div>
                    </div>
                    <div className="py-1  font-poppins text-lg">
                        {description}
                    </div>
                    <div className="text-2xl font-semibold  ">₹ {price}</div>
                    <div className="divider mb-2"></div>
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                            addToCart(product, id);
                        }}
                        className="bg-blue-900 text-white p-3  w-full   rounded-full text-lg "
                    >
                        Add to cart{" "}
                    </button>
                    <div className="divider mt-2"></div>
                    <div className="fixed bottom-0 bg-blue-950 text-white p-4 w-full left-0 flex z-10">
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
                                <div>{word}</div>
                                <div> ₹ {price}</div>
                            </div>
                        </div>
                        <div className="w-6/12  bg-yellow-300 text-black p-2 rounded-full text-lg font-medium flex items-center justify-center">
                            Add to cart
                        </div>
                    </div>
                   <RatingBar/>
                </div>

                {/* customer review section */}
            </div>
        </div>
    );
};

export default ProductData;
