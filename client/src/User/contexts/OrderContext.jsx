import { createContext, useState, useEffect, useContext } from "react";
import { userContext } from "./UserContext";

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const { userId } = useContext(userContext);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState(() => {
    const data = localStorage.getItem("enteBuddyOrders");
    return JSON.parse(data) || null;
  });
  const [orderPlaced, setOrderPlaced] = useState(null);
  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/user/fetchOrders/${userId}`, {
        credentials: "include",
      });

      if (response.status == 401 || response.status == 403) {
        localStorage.clear();
        window.location.href = "/";
      }

      const data = await response.json();

      if (data.orders && data.orders.length > 0) {
        data.orders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(data.orders);
        setAllOrders(data.orders);
        localStorage.setItem("enteBuddyOrders", JSON.stringify(data.orders));
      }
      return data.orders;
    } catch (error) {
      console.error("error fetching orders : ", error);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchOrders,
        allOrders,
        setAllOrders,
        orderPlaced,
        setOrderPlaced,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
