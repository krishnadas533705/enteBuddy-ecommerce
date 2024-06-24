import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/AdminContext";
import API from "razorpay/dist/types/api";

const EditBanner = ({
  bannerEditForm,
  showBannerEditForm,
  editingBanner,
  setFetchBanners,
}) => {
  const [updateData, setUpdateData] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const { adminId } = useContext(AdminContext);
  const API = import.meta.env.API_URL
  useEffect(() => {
    if (editingBanner) {
      const url =
        API + editingBanner.path.split("server")[1];
      setImageUrl(url);
    }
  }, [editingBanner]);

  const handleUpdateData = (e) => {
    const { name, value } = e.target;
    if (name == "bannerImage") {
      setUpdateData((previous) => ({
        ...previous,
        [name]: e.target.files[0],
      }));

      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(imgUrl);
    } else {
      setUpdateData((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    const keys = ["title", "startDate", "endDate", "bannerImage"];

    keys.forEach((key) => {
      const value = updateData[key];
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    const response = await fetch(
      `/api/admin/updateBanner/${adminId}/${editingBanner._id}`,
      {
        method: "put",
        body: formData,
        credentials: "include",
      }
    );

    if (response.ok) {
      console.log("Banner updated");
      setUpdateData({});
      setImageUrl(null);
      setFetchBanners((prev) => !prev);
      showBannerEditForm(!bannerEditForm);
    } else {
      console.log("Error in updating banner");
    }
  };
  return (
    <div
      className={`${
        !bannerEditForm ? "hidden" : ""
      } fixed overflow-scroll inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
    >
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="flex justify-end">
              <button
                className="text-black rounded-full px-2 py-3"
                onClick={() => {
                  setUpdateData({});
                  setImageUrl(null);
                  showBannerEditForm(!bannerEditForm);
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <h2 className="font-semibold text-xl underline text-blue-700">
                EDIT BANNER
              </h2>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                {imageUrl && (
                  <div className=" mb-10 mt-2">
                    <img className="h-60" src={imageUrl} alt="" />
                  </div>
                )}

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="title">Banner Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder={
                          editingBanner && editingBanner.title
                            ? editingBanner.title
                            : ""
                        }
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={updateData.title ? updateData.title : ""}
                        onChange={handleUpdateData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="startDate">Start Date</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="Date"
                          name="startDate"
                          id="startDate"
                          value={
                            updateData.startDate ? updateData.startDate : ""
                          }
                          min={new Date().toISOString().split("T")[0]}
                          onChange={handleUpdateData}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="endDate">End Date</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        {editingBanner && (
                          <input
                            type="Date"
                            name="endDate"
                            id="endDate"
                            value={updateData.endDate ? updateData.endDate : ""}
                            min={
                              updateData.startDate
                                ? updateData.startDate
                                : editingBanner.startDate.split('T')[0]
                            }
                            onChange={handleUpdateData}
                          />
                        )}
                      </div>
                    </div>
                    <br />
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:col-span-1">
                        <label htmlFor="bannerImage">Banner Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          name="bannerImage"
                          id="bannerImage"
                          onChange={handleUpdateData}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
