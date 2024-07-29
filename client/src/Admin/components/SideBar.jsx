import React, { useContext, useState } from "react";
import AdminContext from "../context/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDashboard,
  faPercent,
  faPercentage,
  faSignOut,
  faStore,
  faStoreAlt,
  faStoreSlash,
  faTicket,
  faTruckFast,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { faImage, faUser } from "@fortawesome/free-regular-svg-icons";

const SideBar = () => {
  let { sideBarOpen } = useContext(AdminContext);
  const { adminId, setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const logoutAdmin = async () => {
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
    <section className={``}>
      <aside
        id="default-sidebar"
        className={`absolute left-0  w-64 h-screen transition-transform ${
          sideBarOpen ? "translate-x-0 z-40" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-slate-200 ">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 focus:text-blue-600 focus:bg-gray-100 hover:bg-gray-100  group"
              >
                <FontAwesomeIcon icon={faChartLine} />{" "}
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 hover:bg-gray-100  group"
              >
                <FontAwesomeIcon icon={faStore} />{" "}
                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 hover:bg-gray-100 group active:text-blue-600 active:bg-gray-100"
              >
                <FontAwesomeIcon icon={faTruckFast} />{" "}
                <span className="flex-1 ms-3 whitespace-nowrap">Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/Users"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 hover:bg-gray-100 group"
              >
                <FontAwesomeIcon icon={faUsers} />{" "}
                <span className="ms-3">Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/coupons"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 hover:bg-gray-100 group"
              >
                <FontAwesomeIcon icon={faTicket} />
                <span className="flex-1 ms-3 whitespace-nowrap">Coupons</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/banners"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600  hover:bg-gray-100 group"
              >
                <FontAwesomeIcon icon={faImage} />
                <span className="flex-1 ms-3 whitespace-nowrap">Banners</span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:text-blue-600 hover:bg-gray-100 group"
                onClick={logoutAdmin}
              >
                <FontAwesomeIcon icon={faSignOut} />{" "}
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
};

export default SideBar;
