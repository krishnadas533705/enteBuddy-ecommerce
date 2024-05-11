import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import validateProductData from "./validateProductFrom";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const AddProduct = ({
  productForm,
  showProductForm,
  fetchProduct,
  setFetchProduct,
}) => {
  const [productData, setProductData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [productError, setProductError] = useState({});
  const { adminId } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleProductData = (e) => {
    const { name, value } = e.target;
    if (name == "primaryImage") {
      setProductData((previous) => ({
        ...previous,
        [name]: e.target.files[0],
      }));

      if (e.target.files[0]) {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setImageUrl(imageUrl);
      }
    } else if (name == "secondaryImages") {
      setProductData((previous) => ({
        ...previous,
        [name]: e.target.files,
      }));
    } else {
      setProductData((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
    setProductError((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = async () => {
    const error = validateProductData(productData, setProductError);
    if (!error) {
      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("category", productData.category);
      formData.append("description", productData.description);
      formData.append("color", productData.color ? productData.color : "");
      formData.append("price", productData.price);
      formData.append("quantity", productData.quantity);
      formData.append("discount", productData.discount);
      formData.append("primaryImage", productData.primaryImage);
      for (let i = 0; i < productData.secondaryImages.length; i++) {
        const imageFile = productData.secondaryImages[i];
        formData.append("secondaryImages", imageFile);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]); // Access key and value
      }
      const response = await fetch(
        `/api/admin/addProduct/${adminId}`,
        {
          method: "post",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        setProductData(null);
        setImageUrl(null);
        showProductForm(false);
        setFetchProduct(!fetchProduct);
      } else {
        console.log("failed to add product : ", response);
      }
    }
  };

  return (
    <div
      className={`${
        !productForm ? "hidden" : ""
      } fixed overflow-scroll inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
    >
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="flex justify-end">
              <button
                className="text-black rounded-full px-2 py-3"
                onClick={() => {
                  setProductData(null);
                  setImageUrl(null);
                  setProductError({})
                  showProductForm(false);
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <h2 className="font-semibold text-xl underline text-blue-700">
                ADD NEW PRODUCT
              </h2>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                {imageUrl && (
                  <div className="mb-10 mt-2">
                    <img className="h-60" src={imageUrl} alt="" />
                  </div>
                )}

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="title">Product Title</label>
                      {productError.title && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.title}
                        </span>
                      )}
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Product Title"
                        value={
                          productData && productData.title
                            ? productData.title
                            : ""
                        }
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="category">Category</label>
                      <select
                        name="category"
                        id="category"
                        className="ms-3 h-10 border mt-1 rounded px-4 bg-gray-50"
                        onChange={handleProductData}
                        value={
                          productData && productData.category
                            ? productData.category
                            : ""
                        }
                      >
                        <option value="">Select</option>
                        <option value="Massagers">Massagers</option>
                        <option value="Lubes">Lubes</option>
                      </select>
                      {productError.category && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.category}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="description">Description</label>
                      {productError.description && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.description}
                        </span>
                      )}
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Describe the product"
                        value={
                          productData && productData.description
                            ? productData.description
                            : ""
                        }
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label htmlFor="color">Colours</label>
                      <input
                        type="text"
                        name="color"
                        id="color"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Use comas to separate colours."
                        value={
                          productData && productData.color
                            ? productData.color
                            : ""
                        }
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="price">Price</label>
                      {productError.price && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.price}
                        </span>
                      )}
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Product Price"
                        min={1}
                        value={
                          productData && productData.price
                            ? productData.price
                            : ""
                        }
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="quantity">Quantity</label>
                      {productError.quantity && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.quantity}
                        </span>
                      )}
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          placeholder="Stock"
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={1}
                          value={
                            productData && productData.quantity
                              ? productData.quantity
                              : ""
                          }
                          onChange={handleProductData}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="discount">Discount %</label>
                      {productError.discount && (
                        <span className="text-red-600 text-xs md:text-sm ms-2">
                          {productError.discount}
                        </span>
                      )}
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="number"
                          name="discount"
                          id="discount"
                          placeholder="Discount Percentage"
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={0}
                          value={
                            productData && productData.discount
                              ? productData.discount
                              : ""
                          }
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:col-span-1">
                        <label htmlFor="primaryImage">Primary Image</label>
                        {productError.primaryImage && (
                          <span className="text-red-600 text-xs md:text-sm ms-2">
                            {productError.primaryImage}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          name="primaryImage"
                          id="primaryImage"
                          onChange={handleProductData}
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="primaryImage">Secondary Images</label>
                        {productError.secondaryImages && (
                          <span className="text-red-600 text-xs md:text-sm ms-2">
                            {productError.secondaryImages}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          name="secondaryImages"
                          id="secondaryImages"
                          onChange={handleProductData}
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

export default AddProduct;
