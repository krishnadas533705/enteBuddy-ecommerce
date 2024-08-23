import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AdminContext from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import logo from "../Public/Images/logo.png";

const Navbar = () => {
  let { setSideBar, sideBarOpen, adminId, logoutAdmin } = useContext(AdminContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminId) {
      navigate("/admin/signin");
    }
  }, [true]);

  

  return (
    <nav className="w-full items-center bg-slate-200 h-14 flex justify-between px-7">
      <div className="hidden lg:block text-blue-500 font-bold text-2xl w-1/3">
        Welcome Admin
      </div>
      <button
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none "
        onClick={() => setSideBar(!sideBarOpen)}
      >
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
      <div className="w-1/3">
        <img className="w-28" src={logo}></img>{" "}
      </div>
      <div>
        <button
          className="px-3 py-2 bg-blue-700 text-white rounded font-medium text-xs hover:bg-blue-500"
          onClick={()=>logoutAdmin(navigate)}
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
