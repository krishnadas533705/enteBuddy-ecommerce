import { Router } from "express";
import {
  addAddress,
  addToCart,
  cartMinus,
  createOrder,
  getAddresses,
  getCartItems,
  getProducts,
  removeAddress,
  removeAllFromCart,
  removeFromCart,
  updateAddress,
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

//add new address
router.post("/addAddress/:userId", verifyUser, addAddress);

//list all address
router.get("/getAddresses/:userId", verifyUser, getAddresses);

//updateADdress
router.put("/updateAddress/:userId", verifyUser, updateAddress);

//remove address
router.delete("/removeAddress/:userId", verifyUser, removeAddress);

//get all products
router.get("/getProducts", getProducts);

///order management
router.post("/newOrder/:userId", verifyUser,createOrder);

//razorpay key
router.get("/getRazorpayKey/:userId", verifyUser, (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_ID });
});

export default router;
