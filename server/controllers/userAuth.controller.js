import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// signup or signin controller
export const userAuth = async (req, res, next) => {
  try {
    const mobile = req.body.mobile;
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
    const token = jwt.sign({ userInfo }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res
      .cookie("enteBuddy_access_token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
      .cookie("enteBuddy_access_token", token, {
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

///logout user
export const logoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("enteBuddy_access_token")
      .status(200)
      .send("Logout out successfully");
  } catch (err) {
    next(err);
  }
};
