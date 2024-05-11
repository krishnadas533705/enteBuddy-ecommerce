import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";

const Usertable = ({ users, searching }) => {
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("usersCurrentPage") || 1;
  });

  const [currentUsers, setCurrentUsers] = useState(null);

  useEffect(() => {
    if (users) {
      setTotalPages(Math.ceil(users.length / 5));
      setCurrentUsers(() => {
        console.log("users in table : ", users);
        return users.reverse().slice((currentPage - 1) * 5, currentPage * 5);
      });
    }
    if (searching) {
      setCurrentPage(1);
    }
  }, [users]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    localStorage.setItem("currentBannerPage", page);
    const usersList = users.slice((page - 1) * 5, page * 5);
    setCurrentUsers(usersList);
  };
  return (
    <div className="mt-7 lg:ms-64 px-2">
      <div className="relative overflow-x-auto sm:rounded-lg md:flex justify-center">
        <table className="w-4/5 px-3 text-xs md:text-sm shadow-md text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase">
            <tr>
              <th
                scope="col"
                className="px-6 bg-gray-50   py-3"
              >
                User name
              </th>
              <th scope="col" className="px-6 py-3">
                Mobile
              </th>
              <th
                scope="col"
                className="px-6 bg-gray-50 py-3   "
              >
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers &&
              currentUsers.map((user) => (
                <tr
                  className="border-b border-gray-200 "
                  key={user._id}
                >
                  <th scope="row" className="px-6 py-4 bg-gray-50">
                    {user.userName ? user.userName : user._id}
                  </th>
                  <td className="px-6 py-4 ">
                    {user.mobile ? user.mobile : ""}
                  </td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {user.email ? user.email : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <Pagination
          count={totalPages ? totalPages : 1}
          shape="rounded"
          page={parseInt(currentPage) || 1}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Usertable;
