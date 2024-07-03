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
import Footer from "./User/components/Footer";
import PrivacyPolicy from "./User/pages/PrivacyPolicy";
import Terms from "./User/pages/Terms";
import AgeVerificationProvider from "./User/contexts/AgeVerificationContext";
import Orders from "./User/pages/Orders";
import OrderTracking from "./User/pages/OrderTracking";
import OrderProvider from "./User/contexts/OrderContext";
import RefundPolicy from "./User/pages/RefundPolicy";
import ShippingPolicy from "./User/pages/ShppingPolicy";


const AppLayout =()=>{ 
  return (
    <div>
    <Header/>
    <SideBar/>
    <Outlet/>
    <Footer/>
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
      },
      {
        path : '/privacypolicy',
        element : <PrivacyPolicy />
      },
      {
        path:'/termsandconditions',
        element : <Terms/>
      } ,
      {
        path : '/fetchOrders/:userId',
        element : <Orders/>
      }
     ,{
      path : '/refundPolicyAndCancellation',
      element : <RefundPolicy/>  
    } ,
    {
      path : '/shippingPolicy',
      element : <ShippingPolicy/>
    }
    ]
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
 {
  path : '/orderTracking/:orderId/:productId',
  Component : OrderTracking
 }

]);

const App = () => {
  return (
    <AdminContextProvider> 
      <AgeVerificationProvider>
      <LogProvider>
      <UserProvider>
        <SidebarProvider>
          <CartProvider>
            <ProductProvider> 
              <OrderProvider>
              <RouterProvider router={router} />
              </OrderProvider>
            </ProductProvider>
          </CartProvider>
        </SidebarProvider>
      </UserProvider>
      </LogProvider>
      </AgeVerificationProvider>
    </AdminContextProvider>
  );
};

export default App;
