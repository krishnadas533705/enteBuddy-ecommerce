import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import AdminContext from "../../context/AdminContext";

const DeleteBanner = ({
  deletePrompt,
  showDeletePrompt,
  bannerId,
  setFetchBanners,
}) => {
  const { adminId, logoutAdmin } = useContext(AdminContext);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/deleteBanner/${adminId}`, {
        method: "delete",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ bannerId }),
        credentials: "include",
      });

      if (response.ok) {
        setFetchBanners((pre) => !pre);
        showDeletePrompt(false);
      } else if (response.status == 401 || response.status == 403) {
        logoutAdmin();
      }
    } catch (err) {
      console.log("product deleting error : ", err);
    }
  };
  return (
    <div
      className={`${
        deletePrompt ? "" : "hidden"
      } inset-0 fixed overflow-auto backdrop-blur-sm bg-black bg-opacity-30`}
    >
      <div className="flex justify-center items-center h-full px-3">
        <div className="relative bg-white rounded-lg shadow ">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={() => showDeletePrompt(false)}
          >
            <FontAwesomeIcon icon={faClose} size="xl" />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 ">
              Are you sure you want to remove this banner?
            </h3>

            <div>
              <img src="" alt="" />
            </div>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={handleDelete}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
              onClick={() => showDeletePrompt(false)}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBanner;
