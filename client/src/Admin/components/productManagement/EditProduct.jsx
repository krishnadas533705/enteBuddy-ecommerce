import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import AdminContext from '../../context/AdminContext.js';

const EditProduct = ({
  editForm,
  showEditForm,
  editingProduct,
  setFetchProduct,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const { adminId } = useContext(AdminContext);
  const API = import.meta.env.API_URL
  useEffect(() => {
    if (editingProduct) {
      const url = API + editingProduct.primaryImage.path.split('server')[1];
      setImageUrl(url);
    }
  }, [editingProduct]);
  const handleProductData = (e) => {
    const { name, value } = e.target;

    if (name == 'primaryImage') {
      console.log('Primary image changed');
      setUpdateData((prev) => ({
        ...prev,
        [name]: e.target.files[0],
      }));

      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(imgUrl);
    } else if (name == 'secondaryImages') {
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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // Define keys that need to be appended
      const keys = [
        'title',
        'description',
        'color',
        'price',
        'quantity',
        'discount',
        'primaryImage',
      ];
      // Append keys to FormData object
      keys.forEach((key) => {
        const value = updateData[key];
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      if (updateData.secondaryImages) {
        for (let i = 0; i < updateData.secondaryImages.length; i++) {
          const imageFile = updateData.secondaryImages[i];
          formData.append('secondaryImages', imageFile);
        }
      }

      const response = await fetch(
        `/api/admin/updateProduct/${adminId}/${editingProduct._id}`,
        {
          method: 'put',
          body: formData,
          credentials: 'include',
        }
      );
      if (response.ok) {
        setUpdateData({});
        setFetchProduct((prev) => !prev);
        showEditForm(false);
      }
    } catch (err) {
      console.log('Error in updating : ', err);
    }
  };
  return (
    <div
      className={`${
        !editForm ? 'hidden' : ''
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
                <FontAwesomeIcon icon={faClose} size="2x" />{' '}
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
                        value={updateData.title ? updateData.title : ''}
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
                        value={updateData.category ? updateData.category : ''}
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
                          updateData.description ? updateData.description : ''
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
                            : 'color'
                        }
                        value={updateData.color ? updateData.color : ''}
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
                            : ''
                        }
                        min={1}
                        value={updateData.price ? updateData.price : ''}
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
                              : ''
                          }
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={1}
                          value={updateData.quantity ? updateData.quantity : ''}
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
                              : 'Discount'
                          }
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          min={0}
                          value={updateData.discount ? updateData.discount : ''}
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

export default EditProduct;
