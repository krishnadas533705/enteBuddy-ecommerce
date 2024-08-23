import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import SideBar from "../SideBar";
import AdminContext from "../../context/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";

function OrdersList() {
  const [orders, setOrders] = useState(null);
  const [currentOrders, setCurrentOrders] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("adminOrderPage") || 1;
  });
  const { adminId, setOrderData, handleOrderData, logoutAdmin, setSideBar } = useContext(AdminContext);

  const navigate = useNavigate();
  useEffect(() => {
    setSideBar(false)

    if (!adminId) {
      navigate("/admin/signin");
    }
    (async () => {
      try {
        let response = await fetch(`/api/admin/fetchOrderDetails/${adminId}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          let result = await response.json();
          setOrders(result.allOrders);
          let totalPages = Math.ceil(result.allOrders.length / 5);
          setTotalPages(totalPages);
          let page = parseInt(currentPage)
          let newOrders = result.allOrders.slice((page - 1) * 5 ,page * 5);
          setCurrentOrders(newOrders);
        }
        else if (response.status == 401 || response.status == 403){
          logoutAdmin()
        }
      } catch (err) {
        console.log("error in fetching orders  : ", err);
      }
    })();
  }, []);

  const [filterOn, setFilterStatus] = useState(false);
  const filterByOrderStatus = (value) => {
    if (value == "ALL") {
      setFilterStatus(false);
      let newOrders = orders.slice(0,5);
      setCurrentOrders(newOrders);
      setTotalPages(orders.length)
      setCurrentPage(1)
      localStorage.setItem('adminOrderPage',1)
    } else {
      setFilterStatus(true);
      const result = orders.filter((order) => order.orderStatus == value);
      setTotalPages(result.length)
      setCurrentOrders(result);
      setCurrentPage(1)
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    localStorage.setItem("adminOrderPage", page);
    if (filterOn) {
      let newOrders = currentOrders.slice((page - 1) * 5, page * 5);
      setCurrentOrders(newOrders);
    } else {
      let newOrders = orders.slice((page - 1) * 5, page * 5);
      setCurrentOrders(newOrders);
    }
  };

  return (
    <div className="bg-white h-screen">
      <Navbar />
      <SideBar />
      <section className=" h-full">
        <div className="mt-5 lg:ms-32 flex justify-center">
          <h1 className="text-2xl text-green-700 underline-offset-0 font-medium mb-3">
            DTDC ORDERS
          </h1>
          {/* <form className="md:w-1/3 mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 md:p-4 ps-10 text-sm text-gray-900 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
                placeholder="Search Banners"
                required
              />
              <button
                type="submit"
                className="text-white absolute end-0.5 md:end-2.5 bottom-0.5 md:bottom-2.5 rounded bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-3 py-2"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form> */}
        </div>

        <div className="flex justify-end">
          <div className="relative overflow-x-auto sm:rounded-lg md:flex justify-center">
            <div className="px-5">
              <div className="flex justify-start mb-3">
                <form className="">
                  <label
                    htmlFor="filter"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Filter By Order Status
                  </label>
                  <select
                    id="filter"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => filterByOrderStatus(e.target.value)}
                  >
                    <option defaultValue={true} className="text-gray-300">
                      Select
                    </option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="ALL">ALL</option>
                  </select>
                </form>
              </div>
              <table className="w-4/5 px-3 text-xs md:text-sm shadow-md text-left rtl:text-right text-gray-500 border-gray-300 border-2 ">
                <thead className="text-xs text-gray-700 uppercase ">
                  <tr>
                    <th scope="col" className="px-6 bg-gray-50   py-3">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Products
                    </th>
                    <th scope="col" className="px-6 bg-gray-50 py-3   ">
                      Contact
                    </th>
                    <th scope="col" className="px-6  py-3">
                      Order Date
                    </th>
                    <th scope="col" className="px-6 bg-gray-50  py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6  py-3">
                      Payment ID
                    </th>
                    <th scope="col" className="px-6 bg-gray-50  py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6  py-3">
                      More
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders &&
                    currentOrders.map((order) => (
                      <tr className="border-b border-gray-200 " key={order._id}>
                        <td className="px-6 py-4 ">
                          {order.billing_customer_name}
                        </td>
                        <td className="px-6 py-4 bg-gray-50 ">
                          {order.products &&
                            order.products.map((product) => (
                              <li key={product._id}>{product.productName}</li>
                            ))}
                        </td>
                        <td className="px-6 py-4 ">{order.billing_phone}</td>
                        <td className="px-6 py-4 bg-gray-50 ">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 ">{order.paymentId}</td>
                        <td className="px-6 py-4 bg-gray-50 ">
                          {order.sellingPrice}
                        </td>
                        <td className="px-6 py-4 ">{order.orderStatus}</td>
                        <td className="px-6 py-4 bg-gray-50 ">
                          <button
                            className="underline text-blue-700 hover:text-white hover:bg-blue-700 hover:no-underline p-2 rounded-full"
                            onClick={() => {
                              handleOrderData(order);
                              setOrderData(order);
                              navigate("/admin/orderDetails");
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-10">
                <Pagination
                  count={totalPages ? totalPages : 1}
                  page={parseInt(currentPage) || 1}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrdersList;
