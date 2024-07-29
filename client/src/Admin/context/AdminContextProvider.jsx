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

  const logoutAdmin = () => {
    localStorage.removeItem('adminId')
    setAdmin(null);
    window.location.reload
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
        logoutAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
