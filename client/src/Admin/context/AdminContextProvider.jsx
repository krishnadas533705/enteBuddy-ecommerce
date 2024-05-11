import React, { useEffect, useState } from "react";

import AdminContext from "./AdminContext";

const AdminContextProvider = ({ children }) => {
    const [adminId, setAdmin] = useState(() => { 
      
        return localStorage.getItem("adminId") || null;
        
    });
    const [sideBarOpen, setSideBar] = useState(false);

  
    return (
        <AdminContext.Provider
            value={{ adminId, setAdmin, sideBarOpen, setSideBar }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
