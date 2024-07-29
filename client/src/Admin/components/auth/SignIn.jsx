import React, { useState, useContext, useEffect } from "react";
import { validateForm, verifyAdmin } from "./adminAuth";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import logo from '../../Public/Images/logo.png'

export default function SignIn() {
  let [errors, setErrors] = useState({});
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const navigate = useNavigate();
  let { setAdmin, adminId } = useContext(AdminContext);
  useEffect(()=>{
    if(adminId !== null && adminId !== 'null'){
      navigate("/admin/dashboard")
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = validateForm(email, password);
    if (error.email || error.password) {
      setErrors(error);
      return;
    }
    const response = await verifyAdmin(email, password);
    console.log("response : ",response)
    if (response.statusCode != 403) {
      localStorage.setItem("adminId",response.adminId)
      setAdmin(response.adminId);
      navigate("/admin/dashboard");
    } else {
      setErrors({
        error: response.message,
      });
    }
    return;
  };
  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <img className="w-36 mr-2" src={logo} alt="logo" />
          
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign in to your account
            </h1>
            {errors.error && (
              <span className="text-red-500 text-xs">{errors.error}</span>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-cyan-600 block w-full p-2.5 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password}
                  </span>
                )}
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className={`bg-gray-50 border text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:border-cyan-600 block w-full p-2.5 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
