import { createContext,useState,useEffect, useContext } from "react";
import { userContext } from "./UserContext";

export const OrderContext = createContext();

const OrderProvider =({children})=>{
    const { userId } = useContext(userContext);
    const [orders, setOrders] = useState([]);
console.log(userId)
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
            console.log(data)
            setOrders(data);
            
          
        } catch (error) {
            console.error("error fetching orders : ", error);
        }
    };

return (
    <OrderContext.Provider value= {{orders,fetchOrders}}>
            {children}
    </OrderContext.Provider>
)
} 

export default OrderProvider