import admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import product from "../models/product.model.js";
import { banner } from "../models/banner.model.js";
import User from "../models/user.model.js";
import coupon from "../models/coupons.model.js";
import offers from "../models/offers.model.js";

export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const Admin = await admin.findOne({});
    if (Admin.name == email && Admin.password == password) {
      const token = jwt.sign({ id: Admin._id }, process.env.JWT_SECRET);

      res
        .cookie("admin_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 10000),
        })
        .status(200)
        .json({ adminId: Admin._id });
    } else {
      return next(errorHandler(403, "Access denied"));
    }
  } catch (Err) {
    next(Err);
  }
};

///add new product
export const uploadProduct = async (req, res, next) => {
  try {
    console.log("req.body : ", req.body);
    const primaryImage = {
      name: req.files.primaryImage[0].filename,
      path: req.files.primaryImage[0].path,
    };
    let secondaryImages = req.files.secondaryImages;
    secondaryImages = secondaryImages.map((image) => {
      return {
        name: image.filename,
        path: image.path,
      };
    });
    console.log("secondaryImages : ", secondaryImages);
    let colors;
    if (req.body.color) {
      colors = req.body.color.split(",");
    }

    const newProduct = new product({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      brand: req.body.brand || "EnteBuddy",
      color: colors,
      price: req.body.price,
      quantity: req.body.quantity,
      discount: req.body.discount,
      primaryImage: primaryImage,
      secondaryImages: secondaryImages,
    });
    newProduct.save();
    res.status(200).json({ "New product added with id :": newProduct._id });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    let products = await product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    console.log("req.body : ", req.body);
    let primaryImage;

    if (req.files.primaryImage) {
      primaryImage = {
        name: req.files.primaryImage[0].filename,
        path: req.files.primaryImage[0].path,
      };
    }
    let secondaryImages;
    if (req.files.secondaryImages) {
      secondaryImages = req.files.secondaryImages;
      secondaryImages = secondaryImages.map((image) => {
        return {
          name: image.filename,
          path: image.path,
        };
      });
    }

    let colors;
    if (req.body.color) {
      colors = req.body.color.split(",");
    }

    const update = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      brand: req.body.brand || "EnteBuddy",
      color: colors,
      price: req.body.price,
      quantity: req.body.quantity,
      features: req.body.features,
      discount: req.body.discount,
      primaryImage: primaryImage,
      secondaryImages: secondaryImages,
    };
    await product.updateOne({ _id: productId }, { $set: update });
    res.status(200).json({ "product updated with id :": productId });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    await product.deleteOne({ _id: productId });
    console.log("Product removed");
    res.status(200).json({ "product removed with id : ": productId });
  } catch (err) {
    next(err);
  }
};

/// Banner management

//add new banner
export const addBanner = async (req, res, next) => {
  try {
    const bannerData = {
      title: req.body.title,
      path: req.file.path,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
    };
    const newBanner = new banner(bannerData);
    await newBanner.save();
    res.status(200).json("New banner added");
  } catch (err) {
    next(err);
  }
};

//update banner
export const updateBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.bannerId;
    const bannerData = {
      title: req.body.title,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    };
    console.log("banner image : ", req.file);
    if (req.file) {
      console.log("Bannder image true");
      bannerData.path = req.file.path;
    }

    await banner.updateOne({ _id: bannerId }, { $set: bannerData });
    res.status(200).json("Banner updated");
  } catch (err) {
    next(err);
  }
};

//get all banners data
export const getBanners = async (req, res, next) => {
  try {
    const allBanners = await banner.find({});
    res.status(200).json(allBanners);
  } catch (err) {
    next(err);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const bannerId = req.body.bannerId;
    await banner.deleteOne({ _id: bannerId });
    console.log("Banner removed");
    res.status(200).json({ "Banner removed with id : ": bannerId });
  } catch (err) {
    next(err);
  }
};

/// fetch all user details
export const getUserDetails = async (req, res, next) => {
  try {
    const users = await User.find({});
    console.log("Users found : ", users);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

///coupon management

//list coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await coupon.find({});
    res.status(200).json(coupons);
  } catch (err) {
    next(err);
  }
};

//create new coupon
export const createCoupon = async (req, res, next) => {
  try {
    console.log("coupon data : ", req.body);
    const newCoupon = new coupon(req.body);
    newCoupon.save();
    res.status(200).json("new coupon created");
  } catch (err) {
    next(err);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    console.log("update data : ", req.body);
    console.log("Coupon id : ", req.params.couponId);
    const updateData = req.body;
    const coupontest = await coupon.findOne({ _id: req.params.couponId });
    console.log("coupon exist : ", coupontest);
    await coupon.updateOne({ _id: req.params.couponId }, { $set: updateData });
    console.log("Coupon updated");
    res.status(200).json("Coupon updated");
  } catch (err) {
    next(err);
  }
};

//delete coupon
export const deleteCoupon = async (req, res, next) => {
  try {
    const couponId = req.params.couponId;
    await coupon.deleteOne({ _id: couponId });
    res.status(200).json("coupon removed");
  } catch (err) {
    next(err);
  }
};

///offers management
export const createOffer = async (req, res, next) => {
  try {
    const newOffer = new offers(req.body);
    newOffer.save();
    res.status(200).json("New offer created");
  } catch (err) {
    next(err);
  }
};

//update offer status
export const updateOffer = async (req, res, next) => {
  try {
    const offerStatus = req.body.orderStatus;
    const offerId = req.body.offerId;
    await offers.updateOne(
      { _id: offerId },
      { $set: { isActive: offerStatus } }
    );
    res.status(200).json("Offer updated");
  } catch (err) {
    next(err);
  }
};

// remove offer
export const removeOffer = async (req, res, next) => {
  try {
    const offerId = req.params.offerId;
    await offers.deleteOne({ _id: offerId });
    res.status(200).json("Offer removed");
  } catch (err) {
    next(err);
  }
};

export const getAllOffers = async (req, res, next) => {
  try {
    const allOffers = await offers.find({});
    res.status(200).json(allOffers);
  } catch (err) {
    next(err);
  }
};

/// logout
export const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("admin_token").status(200).send();
  } catch (err) {
    next(err);
  }
};
