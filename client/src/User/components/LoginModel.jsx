/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { IoCloseCircleOutline } from "react-icons/io5";
import { useRef } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { useState, useContext } from "react";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LogContext } from "../contexts/LogContext";
import { auth } from "../utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import peakpx from "../img/peakpx.jpg";
import { userContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";

const LoginModel = () => { 

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState("");
  const [showOtp, setShowOtp] = useState("");
  const [user, setUser] = useState(null);
  const { userId, setUserId } = useContext(userContext);
  const { setCart, fetchCart } = useContext(CartContext);
  const { onClose } = useContext(LogContext);

  const navigate = useNavigate(); //intialize the navigate function

  function onCaptchVerify() {
    if (!window.RecaptchaVerifier) {
      window.RecaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        }
      );
    }
  }
  async function onSignup() {
    setLoading(true);
    await onCaptchVerify();

    const appVerifier = window.RecaptchaVerifier;
    const formatPh = "+" + ph;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOtp(true);
        toast.success("otp sent successfully");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log("firebase response : ", res);
        setUser(res.user);
        setLoading(false);
        console.log("phone number : ", ph);
        if (res.user) {
          await userSignin(); //call the user signin after otp verification
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  async function userSignin() {
    try {
      const response = await fetch("/api/auth/userAuth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ value: ph }),
      });
      if (response.ok) {
        console.log("log success");
        const userData = await response.json();
        console.log(userData);
        localStorage.setItem("enteBuddyUser", userData._id);
        console.log(localStorage.getItem("entebuddyUser"));

        setUser(userData._id);
        setUserId(userData._id);

        await fetchCart(userData._id);
        toast.success("user logged in");

        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose();
      } else {
        alert("failed to log in ");
      }
    } catch (err) {
      console.log("error signing in : ", err);
    }
  }

  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="z-10 text-white fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center "
    >
      <div className="flex flex-col ">
        <div id="recaptcha-container"></div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <button onClick={onClose} className="place-self-end">
          <IoCloseCircleOutline />
        </button>
        <div
          className={`border border-blue-100 py-10 px-10  bg-hero2 bg-tertiary bg-contain rounded-xl flex flex-col gap-5 mx-3 `}
        >
          <h1 className="text-3xl  text-primary  text-center font-poppins ">
            Login through otp
          </h1>

          <hr />
          {showOtp ? (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <BsFillShieldLockFill size={30} />
              </div>
              <label
                htmlFor="otp"
                className="font-bold text-xl text-white text-center"
              >
                Enter your OTP
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container text-black"
              ></OtpInput>
              <button
                onClick={onOTPVerify}
                className="bg-[#54d8b5] w-full flex gap-1 items-center justify-center py-2.5 text-white font-figtree rounded"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <BsTelephoneFill size={30} />
              </div>
              <label
                htmlFor=""
                className="font-semibold text-xl text-secondary text-center font-poppins"
              >
                Verify your phone number
              </label>
              <PhoneInput
                country={"in"}
                value={ph}
                onChange={setPh}
                className="text-black"
              />
              <button
                onClick={onSignup}
                className="bg-secondary w-full flex gap-1 items-center justify-center py-2.5 text-white font-poppins rounded"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Send code via SMS</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModel;
