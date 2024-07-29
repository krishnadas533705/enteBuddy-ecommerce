import { useContext, useEffect, useState } from "react";
import { userContext } from "../contexts/UserContext";
import Shimmer from "../components/Shimmer";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { OrderContext } from "../contexts/OrderContext";
import { Pagination } from "@mui/material";
const Orders = () => {
  const { orders, fetchOrders } = useContext(OrderContext);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrenPage] = useState(1);

  const [currentOrders, setCurrentOrders] = useState(null);
  useEffect(() => {
    (async () => {
      let allOrders = await fetchOrders();
      let totalPages = Math.ceil(allOrders.length / 5);
      setTotalPages(totalPages);
      let page = parseInt(currentPage);
      let firstPageOrders = allOrders.slice((page - 1) * 5, page * 5);
      setCurrentOrders(firstPageOrders);
    })();
  }, []);

  const handlePageChange = (event, page) => {
    let pageOrders = orders.slice((page - 1) * 5, page * 5);
    setCurrentOrders(pageOrders);
    setCurrenPage(page);
  };

  if (orders.length === 0) {
    return (
      <div>
        <Shimmer />
      </div>
    );
  }

  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 px-4 pb-10">
        <div className="flex justify-center mt-3 mb-2 text-3xl font-bold underline text-pink-600">
          <h1>My Orders</h1>
        </div>
        {currentOrders &&
          currentOrders.map((order, orderIndex) => (
            <div
              key={`${order._id}- ${order.products[0]._id} - ${Math.random()}`}
            >
              <div className="w-full mb-1 px-3 py-4 rounded-md flex md:max-w-screen-md md:mx-auto items-center font-poppins shadow-lg">
                <Link
                  state={{
                    orderId: order._id,
                    orderStatus: order.orderStatus,
                  }}
                  to={`/orderTracking/${order._id}`}
                  className="flex items-center w-full"
                >
                  <div className="w-28 h-24 px-2 py-2 mr-3 ">
                    <img
                      src={
                        API +
                        order.products[0]._id.primaryImage.path.split(
                          "server"
                        )[1]
                      }
                      alt="massager image"
                      className="w-full h-full object-fit"
                    />
                  </div>
                  <div>
                    <div className="flex">
                    {order.products.map((product,index) => (
                      <div className="font-medium" key={product._id + Math.random()}>
                        {product.productName } 
                        {index != order.products.length - 1 && 
                          <span className="mx-3">&</span>
                        }
                      </div>
                    ))}
                    </div>
                    <div
                      className={`${
                        order.orderStatus == "Delivered"
                          ? "text-green-600"
                          : order.orderStatus == "Order placed"
                          ? "text-yellow-500"
                          : "text-blue-600"
                      }`}
                    >
                      {order.orderStatus}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty : {order.products.length}
                    </div>
                    <div className="text-xs mt-2 text-gray-500">
                      {new Date(order.orderDate).toDateString()}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mb-14">
        <Pagination
          count={totalPages}
          page={parseInt(currentPage)}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Orders;
