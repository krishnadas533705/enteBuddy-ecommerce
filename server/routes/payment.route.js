import { Router } from "express";
import { createPayment, refundPayment, verifyPayment } from "../controllers/payments.controller.js";
import { verifyUser } from "../utils/authorisation.js";

const router = Router();

//create razorpayOrder
router.post("/createPayment/:userId", verifyUser, createPayment);

router.post("/verifyPayment/:userId",verifyUser,verifyPayment)

router.post("/refundPayment/:userId",verifyUser,refundPayment)

export default router;
