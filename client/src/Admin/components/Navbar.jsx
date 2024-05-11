import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AdminContext from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let { setSideBar, sideBarOpen, adminId } = useContext(AdminContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminId) {
      navigate("/admin/signin");
    }
  }, [true]);
  return (
    <nav className="w-full items-center bg-slate-200 h-14 flex justify-between px-7">
      <div className="hidden lg:block text-blue-500 font-bold text-2xl">
        Welcome Admin
      </div>
      <button
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none "
        onClick={() => setSideBar(!sideBarOpen)}
      >
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
      <div>Logo</div>
      <div>Logout</div>
    </nav>
  );
};

export default Navbar;
