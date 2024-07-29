import React, { useContext, useEffect, useState } from "react";
import SideBar from "../SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../Navbar";
import Usertable from "./Usertable";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const { adminId,logoutAdmin, setSideBar } = useContext(AdminContext);
  const [users, setUsers] = useState(null);
  const [currentUsers, setCurrentUsers] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    setSideBar(false)
    if (!adminId) {
      navigate("/admin/signin");
    }
    (async () => {
      try {
        let userData = await fetch(
          `http://localhost:3000/api/admin/getUsers/${adminId}`,
          {
            credentials: "include",
          }
        );
        if (userData.ok) {
          userData = await userData.json();
          setUsers(userData);
        }
        else if(userData.status == 401 || userData.status ==403){
          logoutAdmin()
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [true]);

  const handleUserSearch = async (e) => {
    const usersList = users.filter((user) => {
      if (
        user.userName?.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
        user.mobile?.startsWith(e.target.value) ||
        user.email?.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) {
        return user;
      }
    });
    if (e.target.value.trim() == "") {
      setCurrentUsers(null);
    } else {
      setCurrentUsers(usersList);
    }
  };
  return (
    <div className="h-screen">
      <Navbar />
      <SideBar />
      <section className="bg-white h-screen">
        <div className="mt-5 lg:ms-32 flex justify-center">
          <form className="md:w-1/3 mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 md:p-4 ps-10 text-sm text-gray-900 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
                placeholder="Search User"
                required
                onChange={handleUserSearch}
              />
              <button
                type="submit"
                className="text-white absolute end-0.5 md:end-2.5 bottom-0.5 md:bottom-2.5 rounded bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-3 py-2 "
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        </div>
      <Usertable
        users={currentUsers ? currentUsers : users}
        searching={currentUsers ? true : false}
      />
      </section>
    </div>
  );
};

export default UsersList;
