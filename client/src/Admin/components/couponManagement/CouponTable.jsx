import { Pagination } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AddCoupon from "./AddCoupon";
import AdminContext from "../../context/AdminContext";
import EditCoupon from "./EditCoupon";
import PrintCoupons from "./PrintCoupons";

const CouponTable = () => {
  const [coupons, setCoupons] = useState(null);
  const [currentCoupons, setCurrentCoupons] = useState(null);
  const [couponForm, showCouponForm] = useState(false);
  const [fetchCoupons, setFetchCoupons] = useState(true);
  const { adminId, logoutAdmin } = useContext(AdminContext);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentCouponPage") || 1
  );

  const [couponEditForm, showCouponEditFrorm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const editCoupon = (item) => {
    setEditingCoupon(item);
    showCouponEditFrorm(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/admin/getCoupons/${adminId}`, {
          credentials: "include",
        });

        if (response.ok) {
          const totalCoupons = await response.json();
          setCoupons(totalCoupons);
          const couponsList = totalCoupons.slice(
            (currentPage - 1) * 5,
            currentPage * 5
          );
          setCurrentCoupons(couponsList);
          setTotalPages(Math.ceil(totalCoupons.length / 5));
        } else if (response.status == 401 || response.status == 403) {
          logoutAdmin();
        }
      } catch (err) {
        console.log("error in fetching coupons : ", err);
      }
    })();
  }, [fetchCoupons]);

  const deleteCoupon = async (couponId) => {
    try {
      const response = await fetch(
        `/api/admin/deleteCoupon/${adminId}/${couponId}`,
        {
          method: "delete",
          credentials: "include",
        }
      );
      if (response.ok) {
        setFetchCoupons((prev) => !prev);
      } else {
        console.log("delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    localStorage.setItem("currentCouponPage", page);
    const couponsList = coupons.slice((page - 1) * 5, page * 5);
    setCurrentCoupons(couponsList);
  };

  const [printer, showPrinter] = useState(false);
  const [currentCouponPrinter, showCurrentCouponPrinter] = useState(false);

  return (
    <div className="mt-7 lg:ms-64 h-screen">
      <div className="text-end justify-end pe-8 md:pe-16">
        <button
          className="px-2 py-2 rounded  text-sm bg-green-600 text-white font-medium"
          onClick={() => showPrinter(true)}
        >
          Print All
        </button>
        <button
          className="px-2 rounded py-2 bg-slate-600 text-white font-medium text-sm ms-1 me-1"
          onClick={() => showCurrentCouponPrinter(true)}
        >
          Print Table
        </button>

        <button
          className="border py-1 px-2 md:py-2 md:px-4 hover:bg-blue-700 bg-blue-600 font-semibold text-white text-sm rounded mb-2"
          onClick={() => showCouponForm(true)}
        >
          NEW COUPON
        </button>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg md:flex justify-center">
        <table className="w-4/5 px-3 text-xs md:text-sm shadow-md text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 bg-gray-50   py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Coupon code
              </th>
              <th scope="col" className="px-6 bg-gray-50 py-3   ">
                Discount %
              </th>
              <th scope="col" className="px-6  py-3">
                Start Date
              </th>
              <th scope="col" className="px-6 bg-gray-50  py-3">
                End Date
              </th>
              <th scope="col" className="px-6  py-3">
                Expired
              </th>
              <th scope="col" className="px-6 bg-gray-50  py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons &&
              currentCoupons.map((item) => (
                <tr className="border-b border-gray-200 " key={item._id}>
                  <th scope="row" className="px-6 py-4 bg-gray-50">
                    {item.title}
                  </th>
                  <td className="px-6 py-4 ">{item.couponCode}</td>
                  <td className="px-6 py-4 bg-gray-50">{item.discount}</td>
                  <td className="px-6 py-4 ">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-6 py-4 ">{item.expired ? "Yes" : "No"}</td>
                  <td className="px-6 py-4 bg-gray-50">
                    <button
                      className="underline text-blue-700 hover:text-white hover:bg-blue-700 hover:no-underline p-2 rounded-full"
                      onClick={() => editCoupon(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="underline text-red-700 hover:bg-red-500 hover:no-underline hover:text-white p-2 rounded-full"
                      onClick={() => deleteCoupon(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-12">
        <Pagination
          count={totalPages ? totalPages : 1}
          shape="rounded"
          page={parseInt(currentPage) || 1}
          onChange={handlePageChange}
        />
      </div>

      <AddCoupon
        couponForm={couponForm}
        showCouponForm={showCouponForm}
        setFetchCoupons={setFetchCoupons}
      />
      <EditCoupon
        couponEditForm={couponEditForm}
        showCouponEditForm={showCouponEditFrorm}
        editingCoupon={editingCoupon}
        fetchCoupon={setFetchCoupons}
      />

      <PrintCoupons
        allCoupons={coupons}
        currentCoupons={currentCoupons}
        printer={printer}
        showPrinter={showPrinter}
        currentCouponPrinter={currentCouponPrinter}
        showCurrentCouponsPrinter={showCurrentCouponPrinter}
      />
    </div>
  );
};

export default CouponTable;
