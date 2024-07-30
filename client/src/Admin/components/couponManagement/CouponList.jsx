import React, { useContext, useEffect } from "react";
import SideBar from "../SideBar.jsx";
import Navbar from "../Navbar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CouponTable from "./CouponTable.jsx";
import { useNavigate } from "react-router-dom";
import AdminContext from "../../context/AdminContext.js";
  
const CouponList = () => {
  const navigate = useNavigate()
  const {adminId,setSideBar} = useContext(AdminContext)
  useEffect(()=>{
    if (!adminId) {
      navigate("/admin/signin");
    }
    setSideBar(false)
  },[])

  const handleProductSearch = async (e) => {
    const searchProducts = await products.filter((item) =>
      item.title.startsWith(e.target.value)
    );
    if (e.target.value.trim() === "") {
      setSearchProducts(null);
    } else {
      setSearchProducts(searchProducts);
    }
  };

  return (
    <div className="h-screen">
      <Navbar />
      <SideBar />

      <section className=" h-screen dark:bg-white dark:text-black">
        <div className="mt-5 lg:ms-32 flex justify-center">
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
                placeholder="Search coupons"
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
      <CouponTable />
    <div>
    </div>

      </section>
    </div>
  );
};

export default CouponList;
