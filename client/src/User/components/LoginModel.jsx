  /* eslint-disable react/prop-types */
  // eslint-disable-next-line no-unused-vars
  import { IoCloseCircleOutline } from "react-icons/io5";
  import { useEffect, useRef } from "react";
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
  import { userContext } from "../contexts/UserContext";
  import { CartContext } from "../contexts/CartContext";

  const LoginModel = () => {
      const [otp, setOtp] = useState("");
      const [ph, setPh] = useState("");
      const [loading, setLoading] = useState("");
      const [showOtp, setShowOtp] = useState("");
      const [user, setUser] = useState(null);
      const [otpError, setOtpError] = useState(null);
      const { userId, setUserId } = useContext(userContext);
      const { setCart, fetchCart } = useContext(CartContext);
      const { onClose } = useContext(LogContext);
      const [verifyLoading,setVerifyLoading]=useState(false)
      const [timer,setTimer]= useState(0)

      const navigate = useNavigate(); //intialize the navigate function
      const cleanupRecaptcha = () => {
        if (window.RecaptchaVerifier) {
          window.RecaptchaVerifier.clear();
          window.RecaptchaVerifier = null;
        }
      };

      useEffect(()=>{ 
        let interval;
        if(timer>0){
            interval = setInterval(()=>{
               setTimer(prev=>(prev-1))     
            },1000)
        }
        
        return ()=>clearInterval(interval)
      },[timer])

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
                  setTimer(60)
              })
              .catch((err) => {
                  setLoading(false);
                  toast.error("invalid phone number")
                  console.log(err)
              });
      }
      const resendOTP = () => {
          setOtpError(false);
          setLoading(true) // Clear error state before resending
          onSignup();
      };

      function onOTPVerify() {
          setVerifyLoading(true);
          window.confirmationResult
              .confirm(otp)
              .then(async (res) => {
                  setUser(res.user);
                  setLoading(false);
                  if (res.user) {
                      await userSignin(); //call the user signin after otp verification
                  }
              })
              .catch((err) => {
                  setVerifyLoading(false);
                  setOtpError(true);
              });
      }

      async function userSignin() {
          try {
              const response = await fetch("/api/auth/userAuth", {
                  method: "POST",
                  headers: {
                      "content-type": "application/json",
                  },
                  body: JSON.stringify({ mobile: ph }),
              });
              if (response.ok) {
                  const userData = await response.json();
                  localStorage.setItem("enteBuddyUser", userData._id);

                  setUser(userData._id);
                  setUserId(userData._id);

                  await fetchCart(userData._id);
                  toast.success("user logged in");

                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  onClose();
              } else {
                  alert("Failed to log in. ");
              }
          } catch (err) {
              console.log("error signing in : ", err);
          }
      }

      const modalRef = useRef();

      const closeModal = (e) => {
          if (modalRef.current === e.target) {
              onClose();
              cleanupRecaptcha()
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
                                  className="opt-container text-black dark:text-white "
                              ></OtpInput>

                              {otpError && (
                                  <p className="text-red-500 text-center mt-2">
                                      Incorrect OTP
                                  </p>
                              )}

                              <button
                                  onClick={onOTPVerify}
                                  className="bg-secondary w-full flex gap-1 items-center justify-center py-2.5 text-gray-800 font-figtree rounded"
                              >
                                  {verifyLoading && (
                                      <CgSpinner
                                          size={20}
                                          className="mt-1 animate-spin"
                                      />
                                  )}
                                  <span>Verify OTP</span>
                              </button>
                              <button
                                  onClick={resendOTP}
                                 disabled={timer>0}
                                  className={`${timer>0 ? 'bg-gray-400': ' bg-secondary'} hover:bg-gray-400  text-gray-800 w-full flex gap-1 items-center justify-center py-2.5 font-figtree rounded mt-2`}
                              > 
                              {
                                loading && (
                                  <CgSpinner size={20}
                                              className="mt-1 animate-spin" />
                                )
                              }
                                  {timer > 0 ? `Resend OTP ( ${timer}s )`: 'Resend OTP' }
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
                                      <CgSpinner
                                          size={20}
                                          className="mt-1 animate-spin"
                                      />
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
