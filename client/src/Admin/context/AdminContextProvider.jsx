import React, { useEffect, useState } from "react";

import AdminContext from "./AdminContext";

const AdminContextProvider = ({ children }) => {
  const [orderData, setOrderData] = useState(() => {
    let data = localStorage.getItem("adminOrderData") || null;

    return data ? JSON.parse(data) : null;
  });

  const handleOrderData = (orderData) => {
    localStorage.setItem("adminOrderData", JSON.stringify(orderData));
  };
  const [adminId, setAdmin] = useState(() => {
    return localStorage.getItem("adminId") || null;
  });
  const [sideBarOpen, setSideBar] = useState(false);

  const logoutAdmin = async (navigate) => {
    try {
      const reponse = await fetch(`/api/admin/signout/${adminId}`, {
        method: "post",
        credentials: "include",
      });
      if (reponse.ok) {
        localStorage.setItem("adminId", null);
        setAdmin(null);
        navigate("/admin/signin");
      } else {
        console.log("logout failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminId,
        setAdmin,
        sideBarOpen,
        setSideBar,
        orderData,
        setOrderData,
        handleOrderData,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
