import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import SideBar from "../SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ProductTable from "./ProductTable";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
const ProductsList = () => {
  const navigate = useNavigate();
  let { adminId, setSideBar } = useContext(AdminContext);
  let [products, setProducts] = useState(null);
  const [fetchProduct, setFetchProduct] = useState(true);
  const [searchProducts, setSearchProducts] = useState(null);
  useEffect(() => {
    setSideBar(false)
    if (!adminId) {
      navigate("/admin/signin");
    }
    (async function () {
      try {
        const response = await fetch(`/api/admin/getProducts/${adminId}`, {
          method: "get",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else if (response.status == 401 || response.status == 403) {
          alert("Unauthorised");
          navigate("/admin/signin");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [fetchProduct]);

  const handleProductSearch = async (e) => {
    const searchProducts = await products.filter((item) =>
      item.title.startsWith(e.target.value)
    );
    if (e.target.value.trim() === "") {
      setSearchProducts(null);
    } else {
      setSearchProducts(searchProducts);
    }
  };


 
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <SideBar />

        {/* search bar */}
        <div className="flex flex-col w-full bg-white">
          <div className="mt-5 lg:ms-72 flex justify-center gap-0">
            <form className="md:w-1/2 w-full px-10 mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-2 md:p-4 ps-10 text-sm text-gray-900 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500"
                  placeholder="Search Products with title"
                  required
                  onChange={handleProductSearch}
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

          <ProductTable
            products={searchProducts ? searchProducts : products}
            fetchProduct={fetchProduct}
            setFetchProduct={setFetchProduct}
            searching={searchProducts ? true : false}
            
          />
        </div>
      </div>
    </>
  );
};

export default ProductsList;
