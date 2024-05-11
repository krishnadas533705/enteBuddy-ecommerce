import { Router } from "express";
import {
  addAddress,
  addToCart,
  cartMinus,
  getAddresses,
  getCartItems,
  getProducts,
  removeAddress,
  removeAllFromCart,
  removeFromCart,
  updateAddress,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/authorisation.js";
import { createOrder } from "../controllers/payments.controller.js";

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

///payments section

//create razorpayOrder
router.post("/createOrder", createOrder);

export default router;
