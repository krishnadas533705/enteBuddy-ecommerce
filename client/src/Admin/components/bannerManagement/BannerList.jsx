import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import SideBar from "../SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import BannerTable from "./BannerTable";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const BannerList = () => {
  const navigate = useNavigate()
  const { adminId, logoutAdmin, setSideBar } = useContext(AdminContext);
  const [banners, setBanners] = useState(null);
  const [fetchBanners, setFetchBanners] = useState(true);

  useEffect(() => {
    setSideBar(false)
    if (!adminId) {
      navigate("/admin/signin");
    }
    (async () => {
      try {
        const response = await fetch(`/api/admin/getBanners/${adminId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const bannersList = await response.json();
          setBanners(bannersList);
        } else if (response.status == 401 || response.status == 403) {
          logoutAdmin();
        }
      } catch (err) {
        console.log("Banner fetching error : ", err);
      }
    })();
  }, [fetchBanners]);

  const [searchBanners, setSearchBanners] = useState(null);
  const handleBannerSearch = async (e) => {
    const bannersList = await banners.filter((item) =>
      item.title.startsWith(e.target.value)
    );
    if (e.target.value.trim() === "") {
      setSearchBanners(null);
    } else {
      setSearchBanners(bannersList);
    }
  };
  return (
    <div className="h-screen">
      <Navbar />
      <SideBar />
      <section className="bg-white h-screen">
        <div className="mt-5 lg:ms-32 flex justify-center">
          <form className="md:w-1/3 mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-2 md:p-4 ps-10 text-sm text-gray-900 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
                placeholder="Search Banners"
                required
                onChange={handleBannerSearch}
              />
              <button
                type="submit"
                className="text-white absolute end-0.5 md:end-2.5 bottom-0.5 md:bottom-2.5 rounded bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-3 py-2"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        </div>

        <div className="">
          <BannerTable
            banners={searchBanners ? searchBanners : banners}
            searching={searchBanners ? true : false}
            fetchBanners={fetchBanners}
            setFetchBanners={setFetchBanners}
          />
        </div>
      </section>
    </div>
  );
};

export default BannerList;
