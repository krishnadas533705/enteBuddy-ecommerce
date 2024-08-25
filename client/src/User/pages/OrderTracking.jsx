import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Shimmer from "../components/Shimmer";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import logo from "../img/logo.png";
import { OrderContext } from "../contexts/OrderContext";
import CourierTracking from "../components/CourierTracking";
import ShiprocketTracking from "../components/ShiprocketTracking";

const OrderTracking = () => {
  const { orderId } = useParams();
  const { allOrders } = useContext(OrderContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (allOrders) {
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
          <div className="w-5 h-10 cursor-pointer" onClick={handleNavigate}>
            <FaArrowLeftLong className="text-xl text-white" />
          </div>

          <div className="w-20 ">
            <img src={logo} alt="enteBuddy logo w-full h-12" />
          </div>
        </div>
        <div className="text-primary text-center text-lg font-poppins font-normal"></div>
      </header>
      <div className="pt-20 ">
        <div className=" flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200 md:max-w-screen-md mx-auto ">
          {/* Products Section */}
          <div className="font-poppins text-center text-sm text-black border-b border-gray-200 py-8 ">
            <p> ORDER ID : {order._id}</p>
            <p>TOTAL : ₹ {order.sellingPrice}</p>
          </div>
          {order.products &&
            order.products.map((product) => (
              <section
                className="pt-6 md:pt-3 pb-1"
                key={ Math.random()}
              >
                <div className="py-3 px-8 font-mono text-lg flex justify-between border-b border-gray-200">
                  <div className="desc">
                    <div>{product.productName}</div>
                    <div>Quantity : {product.quantity}</div>
                    <div>₹ {product.price}</div>
                  </div>
                  <div className="w-24 flex justify-center items-center">
                    {product && product._id ? (
                      <img
                        src={
                          API + product._id.primaryImage.path.split("server")[1]
                        }
                        alt="massager image"
                        className="w-full h-full object-fit"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </section>
            ))}

          {/* Timeline Section */}
          <div className="flex flex-col-reverse md:flex-row justify-between md:me-36  px-4">
            <div className="">
              {order.shippingMethod == "shiprocket" ? (
                <ShiprocketTracking order={order} />
              ) : (
                <CourierTracking order={order} />
              )}
            </div>

            <div>
              <section className="py-4 md:pt-5 md:pb-1">
                <h1 className="font-mono text-lg font-bold text-gray-700">
                  DELIVERING TO
                </h1>
                <div className="pb-5 md:pb-0 border-b-2 md:border-none font-mono text-base md:text-lg border-gray-200">
                  <div className="desc">
                    <div>{order.billing_customer_name}</div>
                    <div>{order.billing_address}</div>
                    <div>{order.billing_city}</div>
                    <div>{order.billing_state}</div>
                    <div>{order.billing_pincode}</div>
                    <div>{order.billing_email}</div>
                    <div>{order.billing_phone}</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
