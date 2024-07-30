import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import validateProductData from "./validateProductFrom";
import AdminContext from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import IconsList from "./IconsList";

const AddProduct = ({
  productForm,
  showProductForm,
  fetchProduct,
  setFetchProduct,
}) => {
  const [productData, setProductData] = useState({});
  const [productFeatures, setProductFeatures] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [productError, setProductError] = useState({});
  const { adminId, logoutAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [listPrompt, setListPrompt] = useState(false);
  const [icon1, setIcon1] = useState(null);
  const [icon2, setIcon2] = useState(null);
  const [icon3, setIcon3] = useState(null);
  const [icon4, setIcon4] = useState(null);

  //service feature icons
  const [serviceIcon1, setServiceIcon1] = useState(null);
  const [serviceIcon2, setServiceIcon2] = useState(null);
  const [serviceIcon3, setServiceIcon3] = useState(null);
  const [serviceIcon4, setServiceIcon4] = useState(null);

  const [updateIcon, setUpdateIcon] = useState(() => {});

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
      //set product features
      const productFeatures = [];

      const featureIcons = [];
      if (productData.productFeature1) {
        productFeatures.push(productData.productFeature1);
        featureIcons.push(icon1);
      }

      if (productData.productFeature2) {
        productFeatures.push(productData.productFeature2);
        featureIcons.push(icon2);
      }
      if (productData.productFeature3) {
        productFeatures.push(productData.productFeature3);
        featureIcons.push(icon3);
      }
      if (productData.productFeature4) {
        productFeatures.push(productData.productFeature4);
        featureIcons.push(icon4);
      }
      let productFeaturesWithIcons = [];
      for (let i = 0; i < productFeatures.length; i++) {
        let feature = {
          description: productFeatures[i],
          icon: featureIcons[i],
        };
        productFeaturesWithIcons.push(feature);
      }

      let serializedProductFeatures = JSON.stringify(productFeaturesWithIcons);

      //set service features

      const serviceFeatures = [];

      const serviceFeatureIcons = [];

      if (productData.serviceFeature1) {
        serviceFeatures.push(productData.serviceFeature1);
        featureIcons.push(serviceIcon1);
      }
      if (productData.serviceFeature2) {
        serviceFeatures.push(productData.serviceFeature2);
        featureIcons.push(serviceIcon2);
      }
      if (productData.serviceFeature3) {
        serviceFeatures.push(productData.serviceFeature3);
        featureIcons.push(serviceIcon3);
      }

      if (productData.serviceFeature4) {
        serviceFeatures.push(productData.serviceFeature4);
        featureIcons.push(serviceIcon4);
      }

      let serviceFeaturesWithIcons = [];

      for (let i = 0; i < serviceFeatures.length; i++) {
        let feature = {
          description: serviceFeatures[i],
          icon: serviceFeatureIcons[i],
        };
        serviceFeaturesWithIcons.push(feature);
      }

      let serializedServiceFeatures = JSON.stringify(serviceFeaturesWithIcons);

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

      formData.append("productFeatures", serializedProductFeatures);
      formData.append("serviceFeatures", serializedServiceFeatures);

      const response = await fetch(`/api/admin/addProduct/${adminId}`, {
        method: "post",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        setProductData(null);
        setImageUrl(null);
        showProductForm(false);
        setFetchProduct(!fetchProduct);
        setIcon1(null);
        setIcon2(null);
        setIcon3(null);
        setIcon4(null);
        setServiceIcon1(null);
        setServiceIcon2(null);
        setServiceIcon3(null);
        setServiceIcon4(null);
      } else if (response.status == 401 || response.status == 403) {
        logoutAdmin();
      } else {
        console.log("failed to add product : ", response);
      }
    }
  };

  return (
    <div
      className={`${
        !productForm ? "hidden" : ""
      } fixed h-screen overflow-scroll inset-0 bg-black backdrop-blur-sm bg-opacity-30`}
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
                  setProductError({});
                  showProductForm(false);
                  setIcon1(null);
                  setIcon2(null);
                  setIcon3(null);
                  setIcon4(null);
                  setServiceIcon1(null);
                  setServiceIcon2(null);
                  setServiceIcon3(null);
                  setServiceIcon4(null);
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
                      <input
                        type="text"
                        name="category"
                        placeholder="Enter catergory name"
                        id="category"
                        className="ms-3 h-10 border mt-1 rounded px-4 bg-gray-50 uppercase text-xs"
                        onChange={handleProductData}
                        value={
                          productData && productData.category
                            ? productData.category
                            : ""
                        }
                      />

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
                    <div className="flex flex-col md:flex-row ">
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
                        <label htmlFor="secondaryImage">Secondary Images</label>
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
                  </div>

                  <div className="mt-5 flex flex-col w-full">
                    <label>Product Features</label>
                    {/* error field */}
                    <div className="flex">
                      <input
                        type="text"
                        className="h-8 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="Feature 1"
                        name="productFeature1"
                        value={
                          productData && productData.productFeature1
                            ? productData.productFeature1
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 mt-1 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setIcon1(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {icon1 && (
                        <div>
                          <img
                            className="h-8 ms-2"
                            src={API + icon1.split("server")[1]}
                            alt=""
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border  rounded px-4 w-full bg-gray-50"
                        placeholder="Feature 2"
                        name="productFeature2"
                        value={
                          productData && productData.productFeature2
                            ? productData.productFeature2
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setIcon2(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {icon2 && (
                        <img
                          className="h-8 ms-2"
                          src={API + icon2.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Feature 3"
                        name="productFeature3"
                        value={
                          productData && productData.productFeature3
                            ? productData.productFeature3
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setIcon3(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {icon3 && (
                        <img
                          className="h-8 ms-2"
                          src={API + icon3.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>
                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Feature 4"
                        name="productFeature4"
                        value={
                          productData && productData.productFeature4
                            ? productData.productFeature4
                            : ""
                        }
                        onChange={handleProductData}
                      />

                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 font-bold text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setIcon4(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {icon4 && (
                        <img
                          className="h-8 ms-2"
                          src={API + icon4.split("server")[1]}
                          alt=""
                        />
                      )}

                      {/* <label htmlFor="productFeatureImages" className="text-xs font-bold mt-2" >Select icons in the order of entered features.</label>
                      <br />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        name="productFeatureImages"
                        id="productFeatureImages"
                        onChange={handleProductData}
                      /> */}
                    </div>
                  </div>
                  <div className="mt-5">
                    <h1 className="">Service Features</h1>
                    <div className="flex mt-2">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Service feature 1"
                        name="serviceFeature1"
                        value={
                          productData && productData.serviceFeature1
                            ? productData.serviceFeature1
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setServiceIcon1(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {serviceIcon1 && (
                        <img
                          className="h-8 ms-2"
                          src={API + serviceIcon1.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>

                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Service feature 2"
                        name="serviceFeature2"
                        value={
                          productData && productData.serviceFeature2
                            ? productData.serviceFeature2
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setServiceIcon2(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {serviceIcon2 && (
                        <img
                          className="h-8 ms-2"
                          src={API + serviceIcon2.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>

                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Service feature 3"
                        name="serviceFeature3"
                        value={
                          productData && productData.serviceFeature3
                            ? productData.serviceFeature3
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setServiceIcon3(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {serviceIcon3 && (
                        <img
                          className="h-8 ms-2"
                          src={API + serviceIcon3.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>

                    <div className="flex mt-3">
                      <input
                        type="text"
                        className="h-8 border rounded px-4 w-full bg-gray-50"
                        placeholder="Service feature 4"
                        name="serviceFeature4"
                        value={
                          productData && productData.serviceFeature4
                            ? productData.serviceFeature4
                            : ""
                        }
                        onChange={handleProductData}
                      />
                      <button
                        className="px-3 h-8 ms-2 py-0 text-sm bg-violet-500 text-white rounded"
                        onClick={() => {
                          setUpdateIcon(() => (path) => setServiceIcon4(path));
                          setListPrompt(true);
                        }}
                      >
                        Icon
                      </button>
                      {serviceIcon4 && (
                        <img
                          className="h-8 ms-2"
                          src={API + serviceIcon4.split("server")[1]}
                          alt=""
                        />
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-5 text-right mt-5">
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
      <IconsList
        listPrompt={listPrompt}
        setListPrompt={setListPrompt}
        updateIcon={updateIcon}
      />
    </div>
  );
};

export default AddProduct;
