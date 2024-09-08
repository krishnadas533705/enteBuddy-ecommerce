import admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import product from "../models/product.model.js";
import { banner } from "../models/banner.model.js";
import User from "../models/user.model.js";
import coupon from "../models/coupons.model.js";
import order from "../models/order.model.js";
import icons from "../models/productIcons.model.js";
import cart from "../models/cart.model.js";

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
          expires: new Date(Date.now() + 24 * 60 * 60 * 100000),
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

//add icons
export const uploadIcons = async (req, res, next) => {
  try {
    let productIcons = req.files;
    productIcons = productIcons.map((icon) => ({
      path: icon.path,
    }));

    await icons.insertMany(productIcons);
    res.status(200).send("Success");
  } catch (err) {
    next(err);
  }
};

//fetch icons
export const fetchIcons = async (req, res, next) => {
  try {
    let allIcons = await icons.find({});
    res.status(200).json(allIcons);
  } catch (err) {
    next(err);
  }
};

///add new product
export const uploadProduct = async (req, res, next) => {
  try {
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
    let colors;
    if (req.body.color) {
      colors = req.body.color.split(",");
    }
    let productFeatures = null;
    let serviceFeatures = null;
    if (req.body.productFeatures) {
      productFeatures = JSON.parse(req.body.productFeatures);
    }
    if (req.body.serviceFeatures) {
      serviceFeatures = JSON.parse(req.body.serviceFeatures);
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
      productFeatures: productFeatures,
      serviceFeatures: serviceFeatures,
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
    let productFeatures;
    let serviceFeatures;
    if (req.body.productFeatures) {
      productFeatures = JSON.parse(req.body.productFeatures);
    }
    if (req.body.serviceFeatures) {
      serviceFeatures = JSON.parse(req.body.serviceFeatures);
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
      productFeatures: productFeatures,
      serviceFeatures: serviceFeatures,
    };
    console.log(update)
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
    await cart.updateMany({}, { $pull: { items: { _id: productId } } });
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
    if (req.file) {
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
    res.status(200).json({ "Banner removed with id : ": bannerId });
  } catch (err) {
    next(err);
  }
};

/// fetch all user details
export const getUserDetails = async (req, res, next) => {
  try {
    const users = await User.find({});
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
    const newCoupon = new coupon(req.body);
    newCoupon.save();
    res.status(200).json("new coupon created");
  } catch (err) {
    next(err);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const updateData = req.body;
    const coupontest = await coupon.findOne({ _id: req.params.couponId });
    await coupon.updateOne({ _id: req.params.couponId }, { $set: updateData });
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

///get dashboard data
export const dashboardData = async (req, res, next) => {
  try {
    let allOrders = await order.aggregate([
      {
        $project: {
          orders: 1,
          _id: 0,
        },
      },
    ]);

    allOrders = allOrders.reduce((acc, cur) => {
      acc = acc.concat(cur.orders);
      return acc;
    }, []);
    const totalSales = allOrders.reduce(
      (sum, order) => sum + order.sellingPrice,
      0
    );
    const totalOrders = allOrders.reduce((acc, cur) => acc + 1, 0);
    const totalUsers = await User.countDocuments({});

    res.status(200).json({ totalOrders, totalSales, totalUsers, allOrders });
  } catch (err) {
    next(err);
  }
};

//fetch all dtdc orders
export const fetchAllOrders = async (req, res, next) => {
  try {
    let allOrders = await order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $match: { "orders.shippingMethod": "DTDC" },
      },
      {
        $unwind: "$orders.products",
      },
      {
        $lookup: {
          from: "products",
          localField: "orders.products._id",
          foreignField: "_id",
          pipeline: [{ $project: { primaryImage: 1 } }],
          as: "productDetails",
        },
      },
      {
        $addFields: {
          "orders.products.primaryImage": {
            $arrayElemAt: ["$productDetails.primaryImage", 0],
          },
        },
      },
      {
        $group: {
          _id: "$orders._id",
          userId: { $first: "$userId" },
          products: {
            $push: {
              _id: "$orders.products._id",
              productName: "$orders.products.productName",
              quantity: "$orders.products.quantity",
              price: "$orders.products.price",
              primaryImage: "$orders.products.primaryImage",
            },
          },
          orderDate: { $first: "$orders.orderDate" },
          orderStatus: { $first: "$orders.orderStatus" },
          paymentMethod: { $first: "$orders.paymentMethod" },
          paymentId: { $first: "$orders.paymentId" },
          billing_customer_name: { $first: "$orders.billing_customer_name" },
          billing_address: { $first: "$orders.billing_address" },
          billing_city: { $first: "$orders.billing_city" },
          billing_state: { $first: "$orders.billing_state" },
          billing_pincode: { $first: "$orders.billing_pincode" },
          billing_email: { $first: "$orders.billing_email" },
          billing_phone: { $first: "$orders.billing_phone" },
          shipRocketOrderId: { $first: "$orders.shipRocketOrderId" },
          sellingPrice: { $first: "$orders.sellingPrice" },
          discount: { $first: "$orders.discount" },
          refundId: { $first: "$orders.refundId" },
          couponId: { $first: "$orders.couponId" },
          shippingMethod: { $first: "$orders.shippingMethod" },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          products: 1,
          orderDate: 1,
          orderStatus: 1,
          paymentMethod: 1,
          paymentId: 1,
          billing_customer_name: 1,
          billing_address: 1,
          billing_city: 1,
          billing_state: 1,
          billing_pincode: 1,
          billing_email: 1,
          billing_phone: 1,
          shipRocketOrderId: 1,
          sellingPrice: 1,
          discount: 1,
          refundId: 1,
          couponId: 1,
          shippingMethod: 1,
        },
      },
    ]);

    res.status(200).json({ allOrders: allOrders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { userId, orderId, orderStatus } = req.body;
    let updateFields = { "orders.$.orderStatus": orderStatus };

    if (orderStatus === "Shipped") {
      updateFields["orders.$.shippedDate"] = new Date();
    } else if (orderStatus === "Delivered") {
      updateFields["orders.$.deliveredDate"] = new Date();
    }
    await order.updateOne({ "orders._id": orderId }, { $set: updateFields });
    res.status(200).send("order update");
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
