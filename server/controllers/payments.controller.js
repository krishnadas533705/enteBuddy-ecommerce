import product from "../models/product.model.js";
import { instance } from "../app.js";
import crypto from "crypto";
import { errorHandler } from "../utils/error.js";
import order from "../models/order.model.js";

export const createPayment = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const options = {
      amount: amount * 100,
      currency: "INR",
      notes: { userId: req.user._id },
    };

    const order = await instance.orders.create(options);
    res.status(200).json({
      order,
      key_id: process.env.RAZORPAY_ID,
      message: "Order created",
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    console.log(expectedSignature, " : ", razorpay_signature);
    if (expectedSignature == razorpay_signature) {
      res.status(200).json("payment success");
    } else {
      throw new Error("Payment not valid")
    }
  } catch (err) {
    next(err);
  }
};

///refund payment
export const refundPayment = async (req, res, next) => {
  try {
    const paymentId = req.body.paymentId;
    const response = await instance.payments.refund(paymentId, {
      speed: "optimum",
    });
    if (response.id) {
      await order.updateOne(
        { _id: req.user._id },
        { $set: { "orders.$[element].refundId": response.id } },
        { arrayFilters: [{ "element.paymentId": paymentId }] }
      );
    } else {
      throw new Error(response.description);
    }
    res.status(200).send("Refund initiated");
  } catch (err) {
    next(err);
  }
};
