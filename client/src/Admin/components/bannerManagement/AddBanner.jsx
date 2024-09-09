import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import AdminContext from "../../context/AdminContext";
import validateBanner from "./validateBanner";
import { toast } from "react-hot-toast";

const AddBanner = ({ bannerForm, showBannerForm, setFetchBanners }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [bannerData, setBannerData] = useState({});
  const [bannerError, setBannerError] = useState({});

  const { adminId, logoutAdmin } = useContext(AdminContext);
  const handleBannerData = (e) => {
    const { name, value } = e.target;
    if (name == "bannerImage") {
      setBannerData((previous) => ({
        ...previous,
        [name]: e.target.files[0],
      }));

      if (e.target.files[0]) {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setImageUrl(imageUrl);
      }
    } else {
      setBannerData((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const isError = validateBanner(bannerData, setBannerError);
    if (!isError) {
      const formData = new FormData();
      formData.append("title", bannerData.title);
      formData.append("startDate", bannerData.startDate);
      formData.append("endDate", bannerData.endDate);
      formData.append("bannerImage", bannerData.bannerImage);

      const addBanner = async () => {
        try {
          new Promise(async (resolve, reject) => {
            const response = await fetch(`/api/admin/addBanner/${adminId}`, {
              method: "post",
              body: formData,
              credentials: "include",
            });

            if (response.ok) {
              showBannerForm(false);
              setBannerData({});
              setImageUrl(null);
              setFetchBanners((prev) => !prev);
              resolve();
            } else if (response.status == 401 || response.status == 403) {
              logoutAdmin();
            } else {
              toast.error("Failed to add banner.", { duration: 2000 });
              reject();
            }
          });
        } catch (err) {
          console.log(err);
        }
      };

      toast.promise(addBanner(), {
        loading: "Adding new banner...",
        success: <b>New banner added.</b>,
        error: <b>Failed to add banner.</b>,
      }); 
    } else {
      console.log("Banner validation error");
    }
  };
  return (
    <div
      className={`${
        !bannerForm ? "hidden" : ""
      } fixed overflow-scroll inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
    >
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="flex justify-end">
              <button
                className="text-black rounded-full px-2 py-3"
                onClick={() => {
                  setBannerData({});
                  setImageUrl(null);
                  showBannerForm(!bannerForm);
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <h2 className="font-semibold text-xl underline text-blue-700">
                ADD NEW BANNER
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
                      {bannerError.title && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {bannerError.title}
                        </span>
                      )}
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Product Title"
                        value={
                          bannerData && bannerData.title ? bannerData.title : ""
                        }
                        onChange={handleBannerData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="startDate">Start Date</label>
                      {bannerError.startDate && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {bannerError.startDate}
                        </span>
                      )}
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="Date"
                          name="startDate"
                          id="startDate"
                          value={
                            bannerData.startDate ? bannerData.startDate : ""
                          }
                          min={new Date().toISOString().split("T")[0]}
                          onChange={handleBannerData}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="endDate">End Date</label>
                      {bannerError.endDate && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {bannerError.endDate}
                        </span>
                      )}
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        {bannerData.startDate && (
                          <input
                            type="Date"
                            name="endDate"
                            id="endDate"
                            value={bannerData.endDate ? bannerData.endDate : ""}
                            min={bannerData.startDate}
                            onChange={handleBannerData}
                          />
                        )}
                      </div>
                    </div>
                    <br />
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:col-span-1">
                        <label htmlFor="bannerImage">Banner Image</label>
                        {bannerError.bannerImage && (
                          <span className="text-red-600 text-xs md:text-sm ms-2">
                            {bannerError.bannerImage}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          name="bannerImage"
                          id="bannerImage"
                          onChange={handleBannerData}
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

export default AddBanner;
