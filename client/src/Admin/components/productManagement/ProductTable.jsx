import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddProduct from "./AddProduct";
import Pagination from "@mui/material/Pagination";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";
import AdminContext from "../../context/AdminContext";

const ProductTable = ({
  products,
  fetchProduct,
  setFetchProduct,
  searching,
}) => {
  const navigate = useNavigate();
  const [productForm, showProductForm] = useState(false);
  const [editForm, showEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentProductPage") || 1
  );
  const [totalPages, setTotalPages] = useState(null);
  const [currentProducts, setCurrentProducts] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    if (products) {
      setTotalPages(Math.ceil(products.length / 5));
      setCurrentProducts(() => {
        return products.reverse().slice((currentPage - 1) * 5, currentPage * 5);
      });
    }
    if (searching) {
      setCurrentPage(1);
    }
  }, [products]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    localStorage.setItem("currentProductPage", page);
    const p = products.slice((page - 1) * 5, page * 5);
    setCurrentProducts(p);
  };
  const [editingProduct, setEditingProduct] = useState(null);
  const editProduct = (product) => {
    showEditForm(true);
    setEditingProduct(product);
  };

  const [deletePrompt, showDeletePrompt] = useState(false);

  const { adminId } = useContext(AdminContext);

  //icons
  const [icons, setIcons] = useState(null);

  const uploadIcons = async () => {
    try {
      if (icons) {
        const formData = new FormData();

        for (let i = 0; i < icons.length; i++) {
          console.log("icon of ", i, " : ", icons[i]);
          const iconFile = icons[i];
          formData.append("icons", iconFile);
        }

        const response = await fetch(`/api/admin/addIcons/${adminId}`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (response.ok) {
          setIcons(null);
          alert("Icons uploaded");
        } else {
          alert("Failed to upload icons.");
        }
      } else {
        alert("Choose icons first.");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div className="mt-7 lg:ms-64 bg-white h-screen">
      <div className="flex justify-end pe-8 md:pe-16">
        <button
          className="border py-1 px-2 md:py-2 md:px-4 hover:bg-blue-700 bg-blue-600 font-semibold text-white text-sm rounded mb-2"
          onClick={() => showProductForm(!productForm)}
        >
          ADD NEW PRODUCT
        </button>
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg md:flex justify-center">
        <table className="w-4/5 px-3 text-xs md:text-sm shadow-md text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              <th scope="col" className="px-6 bg-gray-50 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3  ">
                Title
              </th>
              <th scope="col" className="px-6 py-3 bg-gray-50 ">
                Colour
              </th>
              <th scope="col" className="px-6 py-3  ">
                Category
              </th>
              <th scope="col" className="px-6 bg-gray-50  py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3  ">
                Stock
              </th>
              <th scope="col" className="px-6 bg-gray-50  py-3">
                Total Sale
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts &&
              currentProducts.map((item) => (
                <tr className="border-b border-gray-200 " key={item._id}>
                  <th scope="row" className="px-6 py-4 bg-gray-50">
                    <img
                      className="md:h-20"
                      src={API + item.primaryImage.path.split("server")[1]}
                      alt={item.primaryImage.name}
                    />
                  </th>
                  <td className="px-6 py-4 font-medium">{item.title} </td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {item.color ? item.color.join(",") : ""}
                  </td>
                  <td className="px-6 py-4">
                    {item.category ? item.category : ""}
                  </td>
                  <td className="px-6 py-4 bg-gray-50 ">{item.price}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {item.totalSaleAmount}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="underline text-blue-700 hover:text-white hover:bg-blue-700 hover:no-underline p-2 rounded-full"
                      onClick={() => editProduct(item)}
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
          page={parseInt(currentPage)}
          onChange={handlePageChange}
        />
      </div>

      <div className="md:ms-28 mt-10 mb-20 p-5 w-full bg-white">
        <label htmlFor="icon-input" className="text-sm">
          Click here to add icons.
        </label>
        <br />
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input file-input-bordered file-input-sm text-xs w-1/2 bg-white text-black"
          id="icon-input"
          onChange={(e) => setIcons(e.target.files)}
        />

        <button
          onClick={uploadIcons}
          className="px-2 py-1.5 bg-blue-700 text-white rounded text-sm ms-2 hover:bg-blue-600 focus:bg-blue-800 focus:border-slate-200 "
        >
          Submit
        </button>
      </div>

      <div className="h-screen flex justify-center items-center">
        <AddProduct
          productForm={productForm}
          showProductForm={showProductForm}
          fetchProduct={fetchProduct}
          setFetchProduct={setFetchProduct}
        />
      </div>
      <EditProduct
        editForm={editForm}
        showEditForm={showEditForm}
        editingProduct={editingProduct}
        setFetchProduct={setFetchProduct}
      />

      <DeleteProduct
        deletePrompt={deletePrompt}
        showDeletePrompt={showDeletePrompt}
        productId={deleteId}
        setFetchProduct={setFetchProduct}
      />
    </div>
  );
};

export default ProductTable;
