import { createContext,useState,useEffect, useContext } from "react";
import { userContext } from "./UserContext";

export const OrderContext = createContext();

const OrderProvider =({children})=>{
    const { userId } = useContext(userContext);
    const [orders, setOrders] = useState([]);
    const [allOrders,setAllOrders] = useState(()=>{
        const data = localStorage.getItem("enteBuddyOrders")
        return JSON.parse(data) || null
    })
    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/user/fetchOrders/${userId}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(
                    `error fetching orders : ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            const deliveredOrders = data.orders.filter((order)=>order.orderStatus == 'Delivered')
            const shippedOrders = data.orders.filter((order)=>order.orderStatus == 'Shipped')
            const newOrders = data.orders.filter((order)=>order.orderStatus == 'Order placed')

            const allOrders = [...newOrders,...shippedOrders,...deliveredOrders]
            setOrders(allOrders);
            setAllOrders(allOrders)
            localStorage.setItem("enteBuddyOrders",JSON.stringify(allOrders))
            return allOrders
          
        } catch (error) {
            console.error("error fetching orders : ", error);
        }
    };

return (
    <OrderContext.Provider value= {{orders,fetchOrders,allOrders,setAllOrders}}>
            {children}
    </OrderContext.Provider>
)
} 

export default OrderProvider