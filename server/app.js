import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/userAuth.route.js";
import adminRoute from "./routes/admin.route.js";
import paymentRoute from './routes/payment.route.js'
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import path from "path";

dotenv.config();
const app = express();


const port = process.env.PORT || 3000

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error in connecting database : ", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

export const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.json());
app.use(cookieParser());
// app.use("/Public",express.static('C:/Users/ASWIN/Documents/KD/enteBuddy-ecommerce/server/Public'))
app.use("/Public", express.static('/var/www/enteBuddy-ecommerce/server/Public')); 
// app.use("/Public", express.static("C:/Users/ASUS/OneDrive/Desktop/abhi pro/enteBuddy/server/Public")); 
app.listen(port, () => console.log("server started at port : ",port));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use('/api/payment',paymentRoute)



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  console.log(err);
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});
