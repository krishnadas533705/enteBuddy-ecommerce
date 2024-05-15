import { Router } from "express";
import {
  addReview,
  addToCart,
  cartMinus,
  checkCoupon,
  checkPincode,
  createOrder,
  fetchOrders,
  fetchReviews,
  getCartItems,
  getProducts,
  removeAllFromCart,
  removeFromCart,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/authorisation.js";

const router = Router();

//add new product to cart and also update quantity in the cart
router.post("/addToCart/:userId", verifyUser, addToCart);

//get products from cart
router.get("/getCart/:userId", verifyUser, getCartItems);

//remove product from cart
router.delete("/removeFromCart/:userId/:productId", verifyUser, removeFromCart);

router.delete("/removeAllFromCart/:userId", verifyUser, removeAllFromCart);

//deacrease product quantity in cart
router.put("/cartMinus/:userId/:productId", verifyUser, cartMinus);

//get all products
router.get("/getProducts", getProducts);

///order management
router.post("/newOrder/:userId", verifyUser,createOrder);

//razorpay key
router.get("/getRazorpayKey/:userId", verifyUser, (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_ID });
});


///check courier service availabilty
router.get(`/checkPostCode/:userId/:pincode`,verifyUser,checkPincode)


///fetch all offers
router.get(`/fetchOffers/:userId`,verifyUser)

///check coupon status and apply
router.get(`/checkCoupon/:userId/:couponCode`,verifyUser,checkCoupon)


//get order details
router.get(`/fetchOrders/:userId`,verifyUser,fetchOrders)

///add and fetch reviews
router.get(`/fetchReviews/:productId`,fetchReviews)

router.post(`/addReview/:userId/`,verifyUser,addReview)

export default router;
