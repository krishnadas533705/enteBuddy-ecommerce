import React, { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import AdminContext from "../context/AdminContext";
import {useNavigate} from 'react-router-dom'

const DashBoard = () => {
  const {adminId} = useContext(AdminContext)
  return (
    <>
      <Navbar />
      <SideBar />
      <div className="flex flex-col items-center justify-center">
        <div className="flex mt-10 gap-6 relative left-6">
            <div className="border shadow-lg rounded px-8 py-6 bg-slate-50 flex flex-col justify-center">
                <h1>Total Users </h1>
            </div>
            <div className="border shadow-lg rounded px-8 py-6 bg-slate-50">
              Total Sale
            </div>
            <div></div>
            <div></div>
        </div>
        <div>
          Chart
        </div>
      </div>
    </>
  );
};

export default DashBoard;
