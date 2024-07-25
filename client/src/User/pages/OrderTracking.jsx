import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Shimmer from "../components/Shimmer";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import logo from "../img/logo.png";
import { OrderContext } from "../contexts/OrderContext";

const OrderTracking = () => {
  const { orderId } = useParams();
  const { allOrders } = useContext(OrderContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (allOrders) {
      console.log("allOrders : ", allOrders);
      const currentOrder = allOrders.find((o) => o._id === orderId);
      setOrder(currentOrder);
    }
  }, []);

  if (!order) {
    return <Shimmer />;
  }
  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <div>
      <header className="fixed w-full h-[64px] z-20 shadow-md px-3 flex pt-5  gap-x-1 bg-hero2 bg-contain bg-tertiary justify-between">
        <div className="flex ">
          <div className="w-5 h-10" onClick={handleNavigate}>
            <FaArrowLeftLong className="text-xl text-white" />
          </div>

          <div className="w-20 ">
            <img src={logo} alt="enteBuddy logo w-full h-12" />
          </div>
        </div>
        <div className="text-primary text-center text-lg font-poppins font-normal"></div>
      </header>
      <div className="pt-0 md:pt-24 ">
        <div className=" flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200 md:max-w-screen-md mx-auto ">
          {/* Products Section */}
          <div className="font-poppins text-center text-sm text-gray-400 border-b border-gray-200 pb-3">
            ORDER ID : {order._id}
          </div>
          {order.products &&
            order.products.map((product) => (
              <section className="pt-24 md:py-10 " key={product._id._id}>
                <div className="py-5 px-8 font-mono text-lg flex justify-between items-center border-b border-gray-200">
                  <div className="desc">
                    <div>{product.productName}</div>
                    <div>Quantity : {product.quantity}</div>
                    <div>₹ {product.price}</div>
                  </div>
                  <div className="w-28 h-24 px-2 py-2  flex justify-center items-center">
                    <img
                      src={
                        API + product._id.primaryImage.path.split("server")[1]
                      }
                      alt="massager image"
                      className="w-full h-full object-fit"
                    />
                  </div>
                </div>
              </section>
            ))}

          {/* Timeline Section */}
          {/* initial stage */}
          <div className="flex-auto p-6 relative">
            <div className="absolute left-[35px] top-8 h-[70%] border-r-2 border-gray-200"></div>
            <div className="relative mb-8 flex flex-col justify-center ">
              <div
                className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  order.orderStatus == "Order placed" || order.orderStatus == "Shipped" || order.orderStatus == 'Delivered'
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
              >
                {/* Conditionally render checkmark or blank circle */}
                {order.orderStatus <= "Order placed" || order.orderStatus == "Shipped" || order.orderStatus == 'Delivered' ? (
                  <FaCheck className="text-white" />
                ) : null}
              </div>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-green-900 ">
                  Order Placed
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
                  order.orderStatus == "Shipped" || order.orderStatus == 'Delivered'
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
              >
                {/* Conditionally render checkmark or blank circle */}
                {order.orderStatus <= "Shipped" || order.orderStatus == 'Delivered' ? (
                  <FaCheck className="text-white" />
                ) :  null}
              </div>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-green-900 ">
                  Shipped
                </h6>

                <p className="mt-1 text-xs text-gray-500">
                  {order.orderStatus == 'Shipped' ? new Date(order.shippedDate).toDateString() : ''}
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
                {order.orderStatus <= "Shipped" || order.orderStatus == 'Delivered' ? (
                  <FaCheck className="text-white" />
                ) : null}
              </div>
              <div className="ml-12 w-auto pt-1">
                <h6 className="text-sm font-semibold text-green-900 ">
                  Out For Delivery
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
                  Delivery Complete
                </h6>

                <p className="mt-1 text-xs text-gray-500">
                  {order.orderStatus == 'Delivered' ? new Date(order.deliveredDate).toDateString() : order.orderStatus == 'Shipped' ? "Your order will be delivered within a week." : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
