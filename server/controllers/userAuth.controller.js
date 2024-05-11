import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// signup or signin controller
export const userAuth = async (req, res, next) => {
  console.log("User auth working....");
  console.log("request body : ", req.body);
  const mobile = req.body.mobile;
  try {
    const existingUser = await User.findOne({ mobile });
    let userInfo;
    let newUser;
    if (existingUser) {
      userInfo = existingUser;
    } else {
      newUser = new User({
        mobile,
      });
      await newUser.save();
      userInfo = newUser;
    }
    const token = jwt.sign({ userInfo }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 10000),
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    next(err);
  }
};

//google authenticaion
export const googleAuth = async (req, res, next) => {
  const { userName, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    let userId;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      const newUser = new User({ userName, email });
      await newUser.save();
      userId = newUser._id;
    }
    const userInfo = { userName, _id: userId, email };
    const token = jwt.sign({ userInfo }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 100),
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    next(err);
  }
};
