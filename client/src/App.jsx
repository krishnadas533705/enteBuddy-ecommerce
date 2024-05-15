import React from "react";
import SignIn from "./Admin/components/auth/SignIn";
import AdminContextProvider from "./Admin/context/AdminContextProvider";
import { RouterProvider, createBrowserRouter ,Outlet } from "react-router-dom";
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
import ProductData from "./User/pages/ProductData";
import Header from "./User/components/Header";
import Error from "./User/components/Error";
import SideBar from './User/components/Sidebar';
import LogProvider, { LogContext } from "./User/contexts/LogContext";
import ReviewFormProvider from "./User/contexts/ReviewFormContext";

const AppLayout =()=>{ 
  return (
    <div>
    <Header/>
    <SideBar/>
    <Outlet/>
  </div> 
  )
}
  
  


const router = createBrowserRouter([
  {
    path: "/",
    element : <AppLayout/>,
    errorElement : <Error/>,
    children : [ 
      {
        path : '/',
        element : <Home/>
      },
      {
        path : '/product/:id',
        element : <ProductData/>
      }
    ]
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
 ,

]);

const App = () => {
  return (
    <AdminContextProvider>
      <LogProvider>
      <UserProvider>
        <SidebarProvider>
          <CartProvider>
            <ProductProvider>
              <ReviewFormProvider>
              <RouterProvider router={router} />
              </ReviewFormProvider>
            </ProductProvider>
          </CartProvider>
        </SidebarProvider>
      </UserProvider>
      </LogProvider>
    </AdminContextProvider>
  );
};

export default App;
