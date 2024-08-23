import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import AdminContext from "../../context/AdminContext";

const EditCoupon = ({
  couponEditForm,
  showCouponEditForm,
  editingCoupon,
  fetchCoupon,
}) => {
  const [updateData, setUpdateData] = useState({});
  const { adminId, logoutAdmin } = useContext(AdminContext);
  const handleUpdateData = (e) => {
    setUpdateData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    if (Object.keys(updateData).length !== 0) {
      try {
        const response = await fetch(
          `/api/admin/updateCoupon/${adminId}/${editingCoupon._id}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
            credentials: "include",
          }
        );

        if (response.ok) {
          alert("Coupon updated");
          showCouponEditForm(false);
          setUpdateData({});
          fetchCoupon((prev) => !prev);
        } else if (response.status == 401 || response.status == 403) {
          logoutAdmin()
        } else {
          alert("Coupon update failed");
        }
      } catch (err) {
        console.log("Error in updating coupon");
      }
    } else {
      showCouponEditForm(false);
    }
  };

  return (
    <div
      className={`${
        !couponEditForm ? "hidden" : ""
      } fixed overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
    >
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="container w-fit mx-auto">
          <div>
            <div className="flex justify-end">
              <button
                className="text-black rounded-full px-2 py-3"
                onClick={() => {
                  showCouponEditForm(false);
                  setUpdateData({});
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 text-sm ">
              <h2 className="font-semibold text-xl underline text-blue-700 mb-3">
                EDIT COUPON
              </h2>
              <div className="mb-2 flex items-center">
                <label htmlFor="title" className="text-xs me-2">
                  Coupon title :
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="h-8 mt-1 border rounded px-4 bg-gray-50 focus:outline-sky-500"
                  placeholder={
                    editingCoupon && editingCoupon.title
                      ? editingCoupon.title
                      : ""
                  }
                  value={updateData.title ? updateData.title : ""}
                  onChange={handleUpdateData}
                />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-3">
                  <label htmlFor="discount">Discount : </label>
                  <input
                    type="number"
                    name="discount"
                    id="discount"
                    className="h-8 mt-1 border rounded px-4 bg-gray-50 focus:outline-sky-500"
                    placeholder={
                      editingCoupon && editingCoupon.discount
                        ? editingCoupon.discount
                        : ""
                    }
                    value={updateData.discount ? updateData.discount : ""}
                    min={1}
                    onChange={handleUpdateData}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div>
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
                        value={updateData.startDate ? updateData.startDate : ""}
                        onChange={handleUpdateData}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="md:col-span-2">
                    <label htmlFor="endDate" className="text-xs">
                      End Date
                    </label>
                    <div className="h-10">
                      {editingCoupon && (
                        <input
                          type="Date"
                          name="endDate"
                          id="endDate"
                          className="bg-gray-50 p-1 text-sm rounded border focus:outline-sky-500 "
                          min={
                            updateData.endDate
                              ? updateData.endDate
                              : editingCoupon.startDate.split("T")[0]
                          }
                          value={updateData.endDate ? updateData.endDate : ""}
                          onChange={handleUpdateData}
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
                    UPDATE
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

export default EditCoupon;
