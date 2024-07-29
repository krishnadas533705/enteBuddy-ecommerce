import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { validateCoupon } from "./validateCoupon";
import AdminContext from "../../context/AdminContext";

const AddCoupon = ({ couponForm, showCouponForm, setFetchCoupons }) => {
  const [couponData, setCouponData] = useState({});

  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    const timeStamp = new Date().getTime().toString();
    code += timeStamp.slice(9, timeStamp.length);
    setCouponData((prev) => ({
      ...prev,
      couponCode: code,
    }));
  };

  const updateCouponData = (e) => {
    setCouponData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [couponError, setCouponError] = useState({});
  const { adminId, logoutAdmin } = useContext(AdminContext);
  const handleSubmit = async () => {
    const err = validateCoupon(couponData, setCouponError);
    if (!err) {
      const response = await fetch(
        `/api/admin/createCoupon/${adminId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("New coupon added");
        showCouponForm(false);
        setCouponData({});
        setCouponError({});
        setFetchCoupons((prev)=>!prev)
      }
      else if(response.status == 401 || response.status == 403){
        logoutAdmin()
      }
       else {
        alert("Failed to add coupon");
        setCouponError({});
      }
    }
  };
  return (
    <div
      className={`${
        !couponForm ? "hidden" : ""
      } fixed overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
    >
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="container w-fit mx-auto">
          <div>
            <div className="flex justify-end">
              <button
                className="text-black rounded-full px-2 py-3"
                onClick={() => {
                  showCouponForm(false);
                  setCouponData({});
                  setCouponError({});
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 text-sm ">
              <h2 className="font-semibold text-xl underline text-blue-700 mb-3">
                CREATE NEW COUPON
              </h2>
              {couponError.title && (
                <span className="text-xs text-red-500">
                  {couponError.title}
                </span>
              )}
              <div className="mb-2 flex items-center">
                <label htmlFor="title" className="text-xs me-2">
                  Coupon title :
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="h-8 mt-1 border rounded px-4 bg-gray-50 focus:outline-sky-500"
                  placeholder="Enter coupon title"
                  value={couponData.title ? couponData.title : ""}
                  onChange={updateCouponData}
                />
              </div>
              <div className="mb-2">
                {couponError.discount && (
                  <span className="text-xs text-red-500">
                    {couponError.discount}
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <label htmlFor="discount">Discount : </label>
                  <input
                    type="number"
                    name="discount"
                    id="discount"
                    className="h-8 mt-1 border rounded px-4 bg-gray-50 focus:outline-sky-500"
                    placeholder="Enter discount percentage"
                    min={1}
                    value={couponData.discount ? couponData.discount : ""}
                    onChange={updateCouponData}
                  />
                </div>
              </div>
              <div className="mb-2">
                {couponError.couponCode && (
                  <span className="text-xs text-red-500">
                    {couponError.couponCode}
                  </span>
                )}
                <div className="flex">
                  <input
                    type="couponCode"
                    name="couponCode"
                    id="couponCode"
                    className="h-8 border rounded px-4 bg-gray-50 focus:outline-sky-500"
                    value={couponData.couponCode ? couponData.couponCode : ""}
                    placeholder="Enter custome code or generate code."
                    onChange={updateCouponData}
                  />

                  <button
                    className="px-2 h-8 ms-1 text-xs border bg-orange-600 text-white rounded"
                    onClick={generateCode}
                  >
                    Generate code
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  {couponError.startDate && (
                    <span className="text-xs text-red-500">
                      {couponError.startDate}
                    </span>
                  )}
                  <div className="md:col-span-2">
                    <label htmlFor="startDate" className="text-xs">
                      Start Date
                    </label>
                    <div className="h-10">
                      <input
                        type="Date"
                        name="startDate"
                        id="startDate"
                        className="bg-gray-50 p-1 text-sm rounded border  focus:outline-sky-500 "
                        min={new Date().toISOString().split("T")[0]}
                        value={couponData.startDate ? couponData.startDate : ""}
                        onChange={updateCouponData}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {couponError.endDate && (
                    <span className="text-xs text-red-500">
                      {couponError.endDate}
                    </span>
                  )}
                  <div className="md:col-span-2">
                    <label htmlFor="endDate" className="text-xs">
                      End Date
                    </label>
                    <div className="h-10">
                      {couponData.startDate && (
                        <input
                          type="Date"
                          name="endDate"
                          id="endDate"
                          className="bg-gray-50 p-1 text-sm rounded border focus:outline-sky-500 "
                          min={couponData.startDate}
                          value={couponData.endDate ? couponData.endDate : ""}
                          onChange={updateCouponData}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <br />

              <div className="md:col-span-5 text-right">
                <div className="inline-flex items-end">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                  >
                    CREATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;
