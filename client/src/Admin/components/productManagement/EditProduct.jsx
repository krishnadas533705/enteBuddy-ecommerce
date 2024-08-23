import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/AdminContext.js";
import IconsList from "./IconsList.jsx";

const EditProduct = ({
  editForm,
  showEditForm,
  editingProduct,
  setFetchProduct,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const { adminId, logoutAdmin } = useContext(AdminContext);
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (editingProduct) {
      const url = API + editingProduct.primaryImage.path.split("server")[1];
      setImageUrl(url);
    }
  }, [editingProduct]);
  const handleProductData = (e) => {
    const { name, value } = e.target;

    if (name == "primaryImage") {
      setUpdateData((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));

      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(imgUrl);
    } else if (name == "secondaryImages") {
      setUpdateData((prev) => ({
        ...prev,
        [name]: e.target.files,
      }));
    } else {
      setUpdateData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      let productFeatures = editingProduct.productFeatures
      if(updateData.productFeature1){
        let feature = {
          description:updateData.productFeature1,
          icon:icon1
        }
        productFeatures[0] = feature
      }

      if(updateData.productFeature2){
        let feature = {
          description:updateData.productFeature2,
          icon:icon2
        }
        productFeatures[1] = feature
      }
      if(updateData.productFeature3){
        let feature = {
          description:updateData.productFeature3,
          icon:icon3
        }
        productFeatures[2] = feature
      }
      
      if(updateData.productFeature4){
        let feature = {
          description:updateData.productFeature4,
          icon:icon4
        }
        productFeatures[3] = feature
      }

      let stringifiedProductFeatures = JSON.stringify(productFeatures)
      formData.append('productFeatures',stringifiedProductFeatures)

      let serviceFeatures = editingProduct.serviceFeatures
      if(updateData.serviceFeature1){
        let feature = {
          description:updateData.serviceFeature1,
          icon:serviceIcon1
        }
        serviceFeatures[0] = feature
      }
      if(updateData.serviceFeature2){
        let feature = {
          description:updateData.serviceFeature2,
          icon:serviceIcon2
        }
        serviceFeatures[1] = feature
      }
      if(updateData.serviceFeature3){
        let feature = {
          description:updateData.serviceFeature3,
          icon:serviceIcon3
        }
        serviceFeatures[2] = feature
      }
      if(updateData.serviceFeature4){
        let feature = {
          description:updateData.serviceFeature4,
          icon:serviceIcon4
        }
        serviceFeatures[3] = feature
      }

      let stringifiedServiceFeatures = JSON.stringify(serviceFeatures)
      formData.append('serviceFeatures',stringifiedServiceFeatures)



      // Define keys that need to be appended
      const keys = [
        "title",
        "description",
        "color",
        "price",
        "quantity",
        "discount",
        "primaryImage",
      ];
      // Append keys to FormData object
      keys.forEach((key) => {
        const value = updateData[key];
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });
      if (updateData.secondaryImages) {
        for (let i = 0; i < updateData.secondaryImages.length; i++) {
          const imageFile = updateData.secondaryImages[i];
          formData.append("secondaryImages", imageFile);
        }
      }

      const response = await fetch(
        `/api/admin/updateProduct/${adminId}/${editingProduct._id}`,
        {
          method: "put",
          body: formData,
          credentials: "include",
        }
      );
      if (response.ok) {
        setUpdateData({});
        setFetchProduct((prev) => !prev);
        showEditForm(false);
      } else if (response.status == 401 || response.status == 403) {
        logoutAdmin();
      }
    } catch (err) {
      console.log("Error in updating : ", err);
    }
  };
  return (
    <div
      className={`${
        !editForm ? "hidden" : ""
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
                  showEditForm(false);
                }}
              >
                <FontAwesomeIcon icon={faClose} size="2x" />{" "}
              </button>
            </div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <h2 className="font-semibold text-xl underline text-blue-700">
                EDIT PRODUCT
              </h2>
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                {imageUrl && (
                  <div className="h-72 w-60 mb-10 mt-2">
                    <img src={imageUrl} alt="" />
                  </div>
                )}

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="title">Product Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder={editingProduct && editingProduct.title}
                        value={updateData.title ? updateData.title : ""}
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="category">Category</label>
                      <select
                        name="category"
                        id="category"
                        className="ms-3 h-10 border mt-1 rounded px-4 bg-gray-50 text-xs uppercase"
                        onChange={handleProductData}
                        value={updateData.category ? updateData.category : ""}
                      >
                        <option value="">Select</option>
                        <option value="Massagers">Massagers</option>
                        <option value="Lubes">Lubes</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <label htmlFor="description">Description</label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder={
                          editingProduct && editingProduct.description
                        }
                        value={
                          updateData.description ? updateData.description : ""
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
                        placeholder={
                          editingProduct && editingProduct.color
                            ? editingProduct.color
                            : "color"
                        }
                        value={updateData.color ? updateData.color : ""}
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder={
                          editingProduct && editingProduct.price
                            ? editingProduct.price
                            : ""
                        }
                        min={1}
                        value={updateData.price ? updateData.price : ""}
                        onChange={handleProductData}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="quantity">Quantity</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          placeholder={
                            editingProduct && editingProduct.quantity
                              ? editingProduct.quantity
                              : ""
                          }
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={1}
                          value={updateData.quantity ? updateData.quantity : ""}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="discount">Discount %</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          type="number"
                          name="discount"
                          id="discount"
                          placeholder={
                            editingProduct && editingProduct.discount
                              ? editingProduct.discount
                              : "Discount"
                          }
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={0}
                          value={updateData.discount ? updateData.discount : ""}
                          onChange={handleProductData}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:col-span-1">
                        <label htmlFor="primaryImage">Primary Image</label>
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
                          updateData && updateData.productFeature1
                            ? updateData.productFeature1
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
                          updateData && updateData.productFeature2
                            ? updateData.productFeature2
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
                          updateData && updateData.productFeature3
                            ? updateData.productFeature3
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
                          updateData && updateData.productFeature4
                            ? updateData.productFeature4
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
                          updateData && updateData.serviceFeature1
                            ? updateData.serviceFeature1
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
                          updateData && updateData.serviceFeature2
                            ? updateData.serviceFeature2
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
                          updateData && updateData.serviceFeature3
                            ? updateData.serviceFeature3
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
                          updateData && updateData.serviceFeature4
                            ? updateData.serviceFeature4
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
                  <div className="md:col-span-5 text-right mt-10">
                    <div className="inline-flex items-end">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <IconsList
                    listPrompt={listPrompt}
                    setListPrompt={setListPrompt}
                    updateIcon={updateIcon}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
