import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import AdminContext from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { getDashBoardData, getWeeklyData } from "./DashboardData";
import BarChart from "./BarChart.jsx";

const DashBoard = () => {
  const { adminId, setAdmin, setSideBar } = useContext(AdminContext);
  const [data, setData] = useState(null);
  const [weeklyData, setWeeklyData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setSideBar(false)

    if (!adminId) {
      navigate("/admin/signin");
    } else {
      (async () => {
        const dashBoardData = await getDashBoardData(adminId, setAdmin);
        setData(dashBoardData);

        const thisWeekData = getWeeklyData(dashBoardData.allOrders);
        setWeeklyData(thisWeekData);
      })();
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="lg:flex gap-80">
        <SideBar />

        {/* <!-- Main content --> */}
        <div className="lg:w-3/4 bg-white h-screen">
          {/* <!-- Content header --> */}
          <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>

          {/* <!-- Content --> */}
          <div className="mt-2">
            {/* <!-- State cards --> */}
            <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-2 xl:grid-cols-4">
              {/* <!-- Tickets card --> */}
              <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
                <div>
                  <h6 className="text-xs mb-1 font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                    Total Sales
                  </h6>
                  <span className="text-xl font-semibold">
                    {data ? data.totalSales : "Loading..."}
                  </span>
                </div>
                <div>
                  <span>
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              {/* <!-- Orders card --> */}
              <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
                <div>
                  <h6 className="text-xs mb-1 font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                    Orders
                  </h6>
                  <span className="text-xl font-semibold">
                    {data ? data.totalOrders : "Loading..."}
                  </span>
                </div>
                <div>
                  <span>
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M 5.9375 6 L 5.65625 6.46875 L 3 10.71875 L 3 23 L 21 23 L 21 10.71875 L 18.34375 6.46875 L 18.0625 6 Z M 7.0625 8 L 11 8 L 11 10 L 5.8125 10 Z M 13 8 L 16.9375 8 L 18.1875 10 L 13 10 Z M 5 12 L 19 12 L 19 21 L 5 21 Z M 9 14 L 9 16 L 15 16 L 15 14 Z"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>

              {/* <!-- Users card --> */}
              <div className="flex items-center justify-between p-4 bg-white rounded-md dark:bg-darker">
                <div>
                  <h6 className="text-xs mb-1 font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
                    Users
                  </h6>
                  <span className="text-xl font-semibold">
                    {data ? data.totalUsers : "Loading..."}
                  </span>
                </div>
                <div>
                  <span>
                    <svg
                      className="w-12 h-12 text-gray-300 dark:text-primary-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-10">
            <h1 className=" text-xl lg:text-3xl font-bold uppercase underline">
              THIS WEEK SALES
            </h1>
            {/* Chart data  */}
            <div className="lg:w-4/5">
              <BarChart weeklyData={weeklyData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
