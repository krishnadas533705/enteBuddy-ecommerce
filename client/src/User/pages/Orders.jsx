import { useContext, useEffect, useState } from "react";
import { userContext } from "../contexts/UserContext";
import Shimmer from "../components/Shimmer";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { OrderContext } from  '../contexts/OrderContext'
const Orders = () => {
   
const {orders,fetchOrders} = useContext(OrderContext)
 useEffect(()=>{
  fetchOrders();

 },[]) 
 console.log(orders)

    if (orders.length === 0) {
        return (
            <div>
                <Shimmer />
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="pt-20 px-4 pb-10">
                {orders.orders.map((order, orderIndex) =>
                    order.products.map((product, productIndex) => (
                        <div key={`${order._id}- ${product._id}`}>
                            <div className="w-full mb-1 px-3 py-4 rounded-md flex md:max-w-screen-md md:mx-auto items-center font-poppins ">
                                <Link 
                                    state ={{ 
                                     orderId : order._id,
                                     orderStatus : order.orderStatus,
                                     product : product 
                                    }}
                                    to={`/orderTracking/${order._id}/${product._id}`}
                                    className="flex items-center w-full"
                                    
                                >
                                    <div className="w-28 h-24 px-2 py-2 mr-3 ">
                                        <img
                                            src={logo}
                                            alt="massager image"
                                            className="w-full h-full object-fit"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-">
                                            {product.productName}
                                        </div>
                                        <div>{order.orderStatus}</div>
                                    </div>
                                </Link>
                            </div>
                            {(orderIndex !== orders.orders.length - 1 ||
                                productIndex !== order.products.length - 1) && (
                                <div className="w-full border-b-2 md:max-w-screen-md md:mx-auto"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
