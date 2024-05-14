import React from "react";
import SignIn from "./Admin/components/auth/SignIn";
import AdminContextProvider from "./Admin/context/AdminContextProvider";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashBoard from "./Admin/components/DashBoard";
import ProductsList from "./Admin/components/productManagement/ProductsList";
import AddProduct from "./Admin/components/productManagement/AddProduct";
import BannerList from "./Admin/components/bannerManagement/BannerList";
import UsersList from "./Admin/components/Users/UsersList";
import CouponList from "./Admin/components/couponManagement/CouponList";
import Home from "./User/pages/Home";
import ProductProvider from "./User/contexts/ProductContext";
import CartProvider from "./User/contexts/CartContext";
import SidebarProvider from "./User/contexts/SidebarContext";
import Signin from "./User/pages/Signin";
import UserProvider from "./User/contexts/UserContext";
import Checkout from "./User/pages/Checkout";
import ProfileDetails from "./User/pages/ProfileDetails";
import ProductData from "./User/pages/ProductData";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/signin",
    Component: Signin,
  },
  {
    path: "/admin",
    Component: DashBoard,
    errorElement: <div>404 Not Found!!!</div>,
  },
  {
    path: "/admin/signin",
    Component: SignIn,
  },
  {
    path: "/admin/dashboard",
    Component: DashBoard,
  },
  {
    path: "/admin/products",
    Component: ProductsList,
  },
  {
    path: "/admin/products/addNew",
    Component: AddProduct,
  },
  {
    path: "/admin/banners",
    Component: BannerList,
  },
  {
    path: "/admin/Users",
    Component: UsersList,
  },
  {
    path: "/admin/coupons",
    Component: CouponList,
  },
  {
    path : "/checkout",
    Component : Checkout,
  },
  {
    path: "/profileUpdate",
    Component : ProfileDetails,
  } ,
  {
    path : "/product/:id",
    Component: ProductData,
  }
]);

const App = () => {
  return (
    <AdminContextProvider>
      <UserProvider>
        <SidebarProvider>
          <CartProvider>
            <ProductProvider>
              <RouterProvider router={router} />
            </ProductProvider>
          </CartProvider>
        </SidebarProvider>
      </UserProvider>
    </AdminContextProvider>
  );
};

export default App;
