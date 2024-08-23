import React, { useContext } from "react";
import logo from "../img/logo.png";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import { userContext } from "../contexts/UserContext";

const Footer = () => {
  const [aboutModal, setAboutModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const { userId } = useContext(userContext);
  return (
    <>
      <div className="py-5 md:px-20 bg-hero2 bg-tertiary bg-contain text-secondary font-poppins font-medium h-fit bottom-0 left-0 right-0 flex z-20 relative">
        <div className="flex justify-between w-full  ps-8 pe-3 md:gap-10 lg:ps-14">
          <div className="flex flex-col uppercase text-[8px] py-5 md:text-lg">
            <Link to="/privacypolicy">
              {" "}
              <div className="mb-[10px]">privacy policy</div>
            </Link>
            <Link to="/termsandconditions">
              {" "}
              <div className="mb-[10px]">terms and conditions</div>
            </Link>
            <div
              onClick={() => {
                setAboutModal(!aboutModal);
              }}
              className="cursor-pointer mb-[10px]"
            >
              About us{" "}
            </div>
            <Link to="/shippingPolicy">
              {" "}
              <div className="mb-2 cursor-pointer">
                Shipping and Delivery
              </div>{" "}
            </Link>
          </div>
          <div className="flex flex-col w-56 md:w-60 justify-center items-center ms-3">
            <div>
              <img src={logo} alt="logo" className="" />
            </div>

            <div className="flex justify-evenly  text-primary pe-2 py-4 gap-2 ">
              <Link
                target="_blank"
                to={
                  "https://www.instagram.com/entebuddy/?igsh=MXNkaTZyZHdjbHU1Zw%3D%3D"
                }
              >
                <FaFacebookF />
              </Link>
              <Link
                target="_blank"
                to={
                  "https://www.instagram.com/entebuddy/?igsh=MXNkaTZyZHdjbHU1Zw%3D%3D"
                }
              >
                <FaInstagram className="mx-1" />
              </Link>
              <Link
                target="_blank"
                to={
                  "https://www.instagram.com/entebuddy/?igsh=MXNkaTZyZHdjbHU1Zw%3D%3D"
                }
              >
                <FaTwitter />
              </Link>
            </div>
          </div>
          <div className="flex flex-col uppercase text-[8px] py-6 md:text-lg font-poppins font-medium">
            {userId && (
              <div className="mb-3 cursor-pointer">
                <Link to={`/fetchOrders/${userId}`}>Track your order</Link>
              </div>
            )}

            <div
              onClick={() => {
                setContactModal(!contactModal);
              }}
              className="cursor-pointer mb-3"
            >
              {" "}
              Contact us
            </div>
            <Link to="/refundPolicyAndCancellation">
              {" "}
              <div className="mb-2 cursor-pointer">
                Cancellation and refund policy
              </div>{" "}
            </Link>
          </div>
        </div>
      </div>
      {aboutModal && (
        <AboutUs
          onClose={() => {
            setAboutModal(false);
          }}
        />
      )}

      {contactModal && (
        <ContactUs
          onClose={() => {
            setContactModal(false);
          }}
        />
      )}
    </>
  );
};

export default Footer;
