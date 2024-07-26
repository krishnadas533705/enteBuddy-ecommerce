import React, { useEffect } from "react";
import logo from "../img/logo.png";
import shiprokcet from "../img/shiprocket.jpeg";
import { CartContext } from "../contexts/CartContext";
import { useContext, useState } from "react";
import flag from "../img/flag.jpg";
import DTDC from "../img/DTDC.png";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  GetCountries,
  GetCity,
  GetState,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
  validatePinCode,
} from "../utils/validate";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/UserContext";
import { makePayment } from "../utils/payment";
import { Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { SidebarContext } from "../contexts/SidebarContext";

const Checkout = () => {
  const { cart, totalPrice, couponId, discountPrice } = useContext(CartContext);
  const [stateid, setstateid] = useState(0);
  const [cityid, setcityid] = useState(0);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pinCodeError, setPinCodeError] = useState({ msg: null, error: false });
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const { clearCart } = useContext(CartContext);
  const { handleClose } = useContext(SidebarContext);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    sellingPrice: "",
    discount: "",
    paymentId: "",
    products: cart ? cart : "",
    billing_address: "",
    couponId: couponId ? couponId : "",
    shippingMethod: null,
    paymentMethod: null,
  });
  const [shipMethodError, setShipMethodError] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const { userId } = useContext(userContext);

  useEffect(() => {
    if (userId == null || userId == undefined || userId || "null") {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    setOrderDetails((prev) => ({
      ...prev,
      products: cart,
    }));
  }, [cart]);

  const handleOrderDetails = (name, value) => {
   
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform validation
    if (!validateName(orderDetails.name)) {
      
      setNameError("Please enter your name");
    } else {
      setNameError("");
    }

    if (!validateEmail(orderDetails.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    if (!validatePhoneNumber(orderDetails.mobile)) {
      setPhoneNumberError("Please enter a valid phone number");
    } else {
      setPhoneNumberError("");
    }

    if (
      orderDetails.shippingMethod == null ||
      orderDetails.shippingMethod == ""
    ) {
      setShipMethodError(true);
    } else {
      setShipMethodError(false);
    }

    if (
      orderDetails.shippingMethod == "shiprocket" &&
      orderDetails.paymentMethod == null
    ) {
      setPaymentError(true);
    } else {
      setPaymentError(false);
    }
    validatePinCode(orderDetails.pincode, setPinCodeError, userId);

    if (cityid === 0 || stateid === 0) {
      toast.error("Please choose your city and state");
    }
    // Additional logic for handling form submission
    if (
      validateName(orderDetails.name) &&
      validateEmail(orderDetails.email) &&
      validatePhoneNumber(orderDetails.mobile) &&
      !pinCodeError.error &&
      cityid !== 0 &&
      stateid !== 0 &&
      shipMethodError == false &&
      paymentError == false
    ) {
      // Form submission logic here
      
      if (
        (orderDetails.shippingMethod == "shiprocket" &&
          orderDetails.paymentMethod == "Prepaid") ||
        orderDetails.shippingMethod == "DTDC"
      ) {
        const response = await fetch(`/api/payment/createPayment/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: discountPrice > 0 ? discountPrice : totalPrice,
          }),
          credentials: "include",
        });

        if (response.ok) {
          const paymentOrder = await response.json();
          try {
            await makePayment(
              paymentOrder.key_id,
              paymentOrder.order,
              userId,
              orderDetails
            );
            navigate("/");
            clearCart();
            handleClose();
          } catch (err) {
            alert("payment failed");
          }
        } else {
          console.log("errro in shipping ");
        }
      } else {
        // cash on delivery for shiprocket
        const response = await fetch(`/api/user/newOrder/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orderDetails,
            sellingPrice: discountPrice > 0 ? discountPrice : totalPrice,
          }),
          credentials: "include",
        });

        if (response.ok) {
          alert("order placed successfully");
          localStorage.setItem("enteBuddyCartPrice", 0);
          localStorage.setItem("enteBuddyCart", null);
          localStorage.setItem("enteBuddyCouponId", "");
          navigate(`/fetchOrders/${userId}`);
          clearCart();
          handleClose();
        } else {
          alert("Failed to place order, please try again.");
        }
      }
    }
  };

  return (
    <div className="font-poppins">
      <Toaster toastOptions={{ duration: 2000 }} />
      <div className="flex flex-col items-center border-b bg-white py-2 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <a
          href="#"
          className="text-2xl font-bold text-gray-800 hidden lg:block  "
        >
          <img src={logo} className="w-15 h-10 text-center " alt="logo" />
        </a>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </a>
                <span className="font-semibold text-gray-900">Shop</span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                  href="#"
                >
                  2
                </a>
                <span className="font-semibold text-gray-900">Shipping</span>
              </li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white"
                  href="#"
                >
                  3
                </a>
                <span className="font-semibold text-gray-500">Payment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8 bg-gray-50">
          <p className="text-lg font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border  px-2 py-4 sm:px-6">
            {cart &&
              cart.map((item) => (
                <div
                  className="flex flex-eow rounded-lg    sm:flex-row"
                  key={item._id}
                >
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={API + item.primaryImage.path.split("server")[1]}
                    alt=""
                  />

                  <div className="flex w-full flex-col px-4 py-4 font-poppins">
                    <span className="font-semibold text-xl mb-2">
                      {item.productName}
                    </span>
                    <span className="float-right font-medium text-[14px]">
                      Quantity : {item.quantity}
                    </span>
                    <p className="  text-[14px]  font-medium ">₹{item.price}</p>
                  </div>
                </div>
              ))}
          </div>

          <p className="mt-8 text-lg font-medium">Shipping Methods</p>
          <p className="text-sm text-gray-600">
            Choose any one of the shipping methods.
          </p>
          {shipMethodError && (
            <p className="text-red-500  my-1">
              Select a shipping method before placing the order.
            </p>
          )}
          <form className="mt-3 grid gap-6">
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="shippingMethod"
                value={"shiprocket"}
                onClick={(e) =>
                  handleOrderDetails(e.target.name, e.target.value)
                }
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                htmlFor="radio_1"
              >
                <img
                  className="w-8 object-contain"
                  src={shiprokcet}
                  alt="shiprocket"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    Shiprocket Delivery
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 2 to 4 Days
                  </p>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="dtdc"
                type="radio"
                name="shippingMethod"
                value={"DTDC"}
                onClick={(e) =>
                  handleOrderDetails(e.target.name, e.target.value)
                }
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                htmlFor="dtdc"
              >
                <img
                  className="w-8 object-contain"
                  src={DTDC}
                  alt="shiprocket"
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    DTDC Courier Service
                  </span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 1 to 2 Days
                  </p>
                </div>
              </label>
            </div>
          </form>
          {/* payment method */}
          {orderDetails.shippingMethod == "shiprocket" && (
            <div className="mt-8">
              <h1 className="font-medium text-xl">Payment Method</h1>
              <p className="text-sm text-gray-600">
                Choose payment method for shiprocket delivery.
              </p>
              {paymentError && (
                <p className="text-red-500  my-1">
                  Select payment method before placing the order.
                </p>
              )}
              <div className="relative mt-3">
                <input
                  className="peer hidden"
                  id="cod"
                  type="radio"
                  name="paymentMethod"
                  value={"COD"}
                  onClick={(e) =>
                    handleOrderDetails(e.target.name, e.target.value)
                  }
                />
                <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label
                  className="font-medium peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                  htmlFor="cod"
                >
                  Cash On Delivery
                </label>
              </div>

              <div className="relative mt-3">
                <input
                  className="peer hidden"
                  id="onlinePayment"
                  type="radio"
                  name="paymentMethod"
                  value={"Prepaid"}
                  onClick={(e) =>
                    handleOrderDetails(e.target.name, e.target.value)
                  }
                />
                <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label
                  className="font-medium peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                  htmlFor="onlinePayment"
                >
                  Pay Now
                </label>
              </div>
            </div>
          )}
          {/* ///// */}
        </div>
        <form className="mt-5 grid gap-6">
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-lg font-medium">Payment Details</p>
            <p className="text-gray-400">
              Complete your order by providing your payment details.
            </p>

            <div className=" main div">
              <label
                htmlFor="email"
                className="mt-4 mb-2 block text-sm font-medium font-poppins"
              >
                Name
              </label>
              <div className="">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={orderDetails.name}
                  className={`w-full rounded-md border ${
                    nameError ? "border-red-500" : "border-gray-200"
                  }  px-4 py-3 pl-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="your name"
                  required={true}
                  onChange={(e) =>
                    handleOrderDetails(e.target.name, e.target.value)
                  }
                  onBlur={() => {
                    if (!validateName(orderDetails.name)) {
                      setNameError("Please provide your name");
                    } else {
                      setNameError(null);
                    }
                  }}
                />
              </div>
              {nameError && (
                <p className="text-red-500  text-center my-1">{nameError}</p>
              )}
              <label
                htmlFor="email"
                className="mt-4 mb-2 block text-sm font-medium font-poppins"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  className={`w-full rounded-md border ${
                    emailError ? "border-red-500" : "border-gray-200   "
                  } px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="Your.email@gmail.com"
                  value={orderDetails.email}
                  required
                  onChange={(e) =>
                    handleOrderDetails(e.target.name, e.target.value)
                  }
                  onBlur={() => {
                    if (!validateEmail(orderDetails.email)) {
                      setEmailError("Please provide a valid email address");
                    } else {
                      setEmailError("");
                    }
                  }}
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              {emailError && (
                <p className="text-red-500 text-center">{emailError}</p>
              )}
              <label
                htmlFor="phone number"
                className="mt-4 mb-2 block text-sm font-medium font-poppins"
              >
                Phone number
              </label>
              <div className="">
                <input
                  type="text"
                  id="phonenumber"
                  name="mobile"
                  value={orderDetails.mobile}
                  className={`w-full rounded-md border ${
                    phoneNumberError ? "border-red-500" : "border-gray-200"
                  }  px-4 py-3 pl-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="Your phone number"
                  required
                  onChange={(e) =>
                    handleOrderDetails(e.target.name, e.target.value)
                  }
                  onBlur={() => {
                    if (!validatePhoneNumber(orderDetails.mobile)) {
                      setPhoneNumberError("Please enter a valid Phone number");
                    } else {
                      setPhoneNumberError("");
                    }
                  }}
                />
              </div>
              {phoneNumberError && (
                <p className="text-red-500  text-center">{phoneNumberError}</p>
              )}
              <label
                htmlFor="billing-address"
                className="mt-4 mb-2 block text-sm font-medium font-poppins"
              >
                Billing Address
              </label>
              <div className="">
                <div className="relative flex-shrink-0 sm:w-7/12 ">
                  <input
                    type="text"
                    id="billing-address"
                    name="billing_address"
                    value={orderDetails.billing_address}
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Street Address"
                    required
                    onChange={(e) =>
                      handleOrderDetails(e.target.name, e.target.value)
                    }
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <img className="h-4 w-4 object-contain" src={flag} alt="" />
                  </div>
                </div>
                <div className="font-medium font-poppins text-sm my-2 ">
                  <h6 className="mb-2">State</h6>
                  <StateSelect
                    countryid={101}
                    onChange={(e) => {
                      setstateid(e.id);
                      handleOrderDetails("state", e.name);
                    }}
                    placeHolder="Select State"
                    required
                  />
                </div>

                <div className="font-poppins text-sm font-medium my-2">
                  <div></div>
                  <h2 className="mb-2">City</h2>
                  <CitySelect
                    countryid={101}
                    stateid={stateid}
                    onChange={(e) => {
                      setcityid(e.id);
                      handleOrderDetails("city", e.name);
                    }}
                    placeHolder="Select city"
                    required
                  />

                  <input
                    type="text"
                    name="pincode"
                    value={orderDetails.pincode}
                    className="flex-shrink-0 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none sm:w-1/6 focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Pin code"
                    onChange={(e) => {
                      handleOrderDetails(e.target.name, e.target.value);
                    }}
                    onInput={(e) =>
                      validatePinCode(e.target.value, setPinCodeError, userId)
                    }
                  />
                </div>
                {console.log("isError : ", pinCodeError.error)}
                {pinCodeError.msg && (
                  <p
                    className={`text-center text-sm ${
                      !pinCodeError.error ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {pinCodeError.msg}
                  </p>
                )}
              </div>

              {/* <!-- Total --> */}

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{discountPrice > 0 ? discountPrice : totalPrice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
