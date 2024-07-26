import React from "react";
import { FaCheck } from "react-icons/fa";

function CourierTracking({ order }) {
  return (
    <div>
      {order.shippingMethod == "DTDC" && (
        <div className="flex-auto p-6 relative">
          <div className="absolute left-[35px] top-8 h-[70%] border-r-2 border-gray-200"></div>
          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  order.orderStatus == "Order placed" ||
                  order.orderStatus == "Shipped" ||
                  order.orderStatus == "Delivered"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {order.orderStatus <= "Order placed" ||
              order.orderStatus == "Shipped" ||
              order.orderStatus == "Delivered" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                ORDER PLACED
              </h6>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(order.orderDate).toDateString()}
              </p>
            </div>
          </div>
          {/* Shipped */}
          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white

                ${
                  order.orderStatus == "Shipped" ||
                  order.orderStatus == "Delivered"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {order.orderStatus <= "Shipped" ||
              order.orderStatus == "Delivered" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">SHIPPED</h6>

              <p className="mt-1 text-xs text-gray-500">
                {order.orderStatus == "Shipped"
                  ? new Date(order.shippedDate).toDateString()
                  : ""}
              </p>
            </div>
          </div>
          {/* Out for delivery */}
          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  order.orderStatus == "Delivered"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {order.orderStatus <= "Shipped" ||
              order.orderStatus == "Delivered" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                OUT FOR DELIVERY
              </h6>
            </div>
          </div>
          {/* Delivered */}
          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  order.orderStatus == "Delivered"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {order.orderStatus <= "Delivered" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                DELIVERY COMPLETE
              </h6>

              <p className="mt-1 text-xs text-gray-500">
                {order.orderStatus == "Delivered"
                  ? new Date(order.deliveredDate).toDateString()
                  : order.orderStatus == "Shipped"
                  ? "Your order will be delivered within a week."
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourierTracking;
