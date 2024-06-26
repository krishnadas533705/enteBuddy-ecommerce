import React, { useEffect, useState } from 'react';
import AddBanner from './AddBanner';
import EditBanner from './EditBanner';
import Pagination from '@mui/material/Pagination';
import DeleteBanner from './DeleteBanner';

const BannerTable = ({ banners, searching, fetchBanners, setFetchBanners }) => {
  const [bannerForm, showBannerForm] = useState(false);
  const [bannerEditForm, showBannerEditForm] = useState(false);
  const API = import.meta.env.VITE_API_URL

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentBannerPage') || 1
  );
  const [totalPages, setTotalPages] = useState(null);
  const [currentBanners, setCurrentBanners] = useState(null);

  const [deletePrompt, showDeletePrompt] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    if (banners) {
      setTotalPages(Math.ceil(banners.length / 5));
      setCurrentBanners(() => {
        return banners.reverse().slice((currentPage - 1) * 5, currentPage * 5);
      });
    }
    if (searching) {
      setCurrentPage(1);
    }
  }, [banners]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    localStorage.setItem('currentBannerPage', page);
    const bannersList = banners.slice((page - 1) * 5, page * 5);
    setCurrentBanners(bannersList);
  };

  const [editingBanner, setEditingBanner] = useState(null);
  const editBanner = (item) => {
    setEditingBanner(item);
    showBannerEditForm(true);
  };
  return (
    <div className="mt-7 lg:ms-64">
      <div className="flex justify-end pe-8 md:pe-16">
        <button
          className="border py-1 px-2 md:py-2 md:px-4 hover:bg-blue-700 bg-blue-600 font-semibold text-white text-sm rounded mb-2"
          onClick={() => showBannerForm(!bannerForm)}
        >
          ADD NEW
        </button>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg md:flex justify-center">
        <table className="w-4/5 px-3 text-xs md:text-sm shadow-md text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 bg-gray-50   py-3">
                Banner
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 bg-gray-50 py-3   ">
                Start Date
              </th>
              <th scope="col" className="px-6  py-3">
                End Date
              </th>
              <th scope="col" className="px-6 bg-gray-50  py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {console.log('current banners : ', currentBanners)}
            {currentBanners &&
              currentBanners.map((item) => (
                <tr className="border-b border-gray-200 " key={item._id}>
                  <th scope="row" className="px-6 py-4 bg-gray-50">
                    <img
                      className="md:h-20"
                      src={API + item.path.split('server')[1]}
                      alt={item.title}
                    />
                  </th>
                  <td className="px-6 py-4 ">{item.title}</td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString()
                      : ''}
                  </td>
                  <td className="px-6 py-4 ">
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : ''}
                  </td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    <button
                      className="underline text-blue-700 hover:text-white hover:bg-blue-700 hover:no-underline p-2 rounded-full"
                      onClick={() => editBanner(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="underline text-red-700 hover:bg-red-500 hover:no-underline hover:text-white p-2 rounded-full"
                      onClick={() => {
                        setDeleteId(item._id);
                        showDeletePrompt(true);
                      }}
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
      <AddBanner
        showBannerForm={showBannerForm}
        bannerForm={bannerForm}
        setFetchBanners={setFetchBanners}
      />
      <EditBanner
        showBannerEditForm={showBannerEditForm}
        bannerEditForm={bannerEditForm}
        editingBanner={editingBanner}
        setFetchBanners={setFetchBanners}
      />

      <DeleteBanner
        showDeletePrompt={showDeletePrompt}
        deletePrompt={deletePrompt}
        bannerId={deleteId}
        setFetchBanners={setFetchBanners}
      />
    </div>
  );
};

export default BannerTable;
