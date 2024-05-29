import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  // product state
  const [products, setProducts] = useState([]);
  //  fetch products
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const data = await fetch(`/api/user/getProducts`);
    const json = await data.json();
    setProducts(json);
  };
  return (
    <ProductContext.Provider value={{ products }}>
      {children}  
    </ProductContext.Provider>
  );
};

export default ProductProvider;
