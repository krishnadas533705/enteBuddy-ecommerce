import React, { useContext } from "react";
import Navbar from "../Navbar";
import AdminContext from "../../context/AdminContext";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from '../../Public/Images/logo.png'

function OrderDetails() {
  const API = import.meta.env.VITE_API_URL;
  const { adminId, setOrderData, orderData, handleOrderData } =
    useContext(AdminContext);

  const updateOrderStatus = async (e) => {
    const updateData = {
      orderStatus: e.target.value,
      orderId: orderData._id,
    };

    const response = await fetch(`/api/admin/updateOrderStatus/${adminId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    });

    if (response.ok) {
      alert("order status updated.");

      setOrderData((prev) => ({
        ...prev,
        orderStatus: updateData.orderStatus,
      }));
      let data = orderData;
      data.orderStatus = updateData.orderStatus;
      handleOrderData(data);
    } else {
      alert("failed to update order status.Try again.");
    }
  };
  return (
    <div>
      <nav className="w-full items-center bg-slate-200 h-14 flex justify-center px-7">
        <div className="w-1/3">
          <img className="w-28" src={logo}></img>{" "}
        </div>
      </nav>

      <section className="p-8 bg-white h-screen">
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-medium ">Order Details </h1>
          <h1 className=" md:text-xl font-medium">
            Status :{" "}
            <span
              className={`${
                orderData.orderStatus == "Delivered"
                  ? "text-green-500"
                  : orderData.orderStatus == "Shipped"
                  ? "text-blue-600"
                  : "text-yellow-500"
              }`}
            >
              {orderData.orderStatus}
            </span>
          </h1>
        </div>
        <hr />
        <div className="flex flex-col">
          {/* product section */}

          {orderData.products &&
            orderData.products.map((product) => (
              <div className="flex" key={product._id}>
                <div className="p-3">
                  <img
                    className="w-36 h-36"
                    src={API + product.primaryImage.path.split("server")[1]}
                    alt=""
                  />
                </div>
                <div className="p-3 ">
                  <h1 className="font-medium font-sans text-lg">
                    {product.productName}
                  </h1>
                  <p className="text-sm text-gray-500 mt-2 mb-1">
                    Qantity :{" "}
                    <span className="text-black">{product.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Price :{" "}
                    <span className="text-black">
                      {" "}
                      <FontAwesomeIcon icon={faIndianRupee} /> {product.price}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          <hr />
          <div className=" flex flex-col md:flex-row gap-8 md:gap-16 p-3">
            <div>
              <h1 className="text-lg underline font-medium mb-1">
                Shipping Address
              </h1>
              <p className="text-gray-500">
                Name :{" "}
                <span className="text-black">
                  {orderData.billing_customer_name}
                </span>
              </p>
              <p className="text-gray-500">
                Address :{" "}
                <span className="text-black">{orderData.billing_address}</span>
              </p>
              <p className="text-gray-500">
                City :{" "}
                <span className="text-black">{orderData.billing_city}</span>
              </p>
              <p className="text-gray-500">
                State :{" "}
                <span className="text-black">{orderData.billing_state}</span>
              </p>
              <p className="text-gray-500">
                Pincode :{" "}
                <span className="text-black"> {orderData.billing_pincode}</span>
              </p>
              <p className="text-gray-500">
                Email :{" "}
                <span className="text-black">{orderData.billing_email}</span>
              </p>
              <p className="text-gray-500">
                Phone :{" "}
                <span className="text-black">{orderData.billing_phone}</span>
              </p>
            </div>

            <div>
              <h1 className="text-lg underline font-medium mb-1">
                Payment Details
              </h1>
              <p className="text-gray-500">
                Method : <span className="text-black">Prepaid</span>
              </p>
              <p className="text-gray-500">
                payment ID :{" "}
                <span className="text-black">{orderData.paymentId}</span>
              </p>
              <p className="text-gray-500">
                Discount :{" "}
                <span className="text-black">
                  {" "}
                  {orderData.discount == null ? 0 : orderData.discount}
                </span>
              </p>
            </div>
          </div>
          <hr />

          <div>
            <form className="max-w-sm mx-auto mt-8 pb-14">
              <label
                htmlFor="orderStatus"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-white uppercase"
              >
                Update Order Status
              </label>
              <select
                id="orderStatus"
                className="bg-gray-50 border border-gray-300 w-full text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={updateOrderStatus}
              >
                <option defaultValue={true} className="text-gray-300">
                  Select
                </option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Order Placed">Order Placed</option>
              </select>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetails;
