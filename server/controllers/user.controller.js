import userAddress from "../models/address.model.js";
import cart from "../models/cart.model.js";
import product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

/// add a new item to the product
export const addToCart = async (req, res, next) => {
  try {
    if (req.user) {
      console.log("Adding to cart....");
      const productData = {
        _id: req.body._id,
        productName: req.body.title,
        price: req.body.price,
      };
      console.log("Product Data : ", productData);
      const userCart = await cart.findOne({ userId: req.user._id });
      if (userCart) {
        userCart.addProduct(productData);
        userCart.save();
      } else {
        const newCart = new cart({
          userId: req.user._id,
          items: [],
        });
        newCart.save();
        newCart.addProduct(productData);
      }
      res.status(200).json("product added to cart");
    } else {
      return errorHandler(401, "Unauthorised");
    }
  } catch (err) {
    next(err);
  }
};

//decrease cart product quantity
export const cartMinus = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userCart = await cart.findOne({ userId: req.user._id });
    userCart.items.forEach((item) => {
      if (item._id == productId) {
        item.quantity--;
      }
    });
    userCart.save();
    res.status(200).json("cart updated");
  } catch (err) {
    next(err);
  }
};

///query products in the cart
export const getCartItems = async (req, res, next) => {
  try {
    const cartItems = await cart
      .findOne({ userId: req.user._id })
      .populate("items._id");
    const cartProducts = cartItems.items.map((item) => ({
      _id: item._id._id,
      primaryImage: item._id.primaryImage,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    }));
    console.log("cartitems : ", cartProducts);
    res.status(200).json(cartProducts);
  } catch (err) {
    next(err);
  }
};

///remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const thisCart = await cart.findOne({ userId: req.user._id });
    thisCart.removeFromCart(productId);
    thisCart.save();
    res.status(200).json("item removed from cart");
  } catch (err) {
    next(err);
  }
};

export const removeAllFromCart = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await cart.updateOne({ userId: userId },{$set:{items:[]}});
    res.status(200).json("item removed from cart");
  } catch (err) {
    next(err);
  }
};

///add new address
export const addAddress = async (req, res, next) => {
  try {
    const address = await userAddress.findOne({ userId: req.user._id });
    if (address == null) {
      const addressData = {
        userId: req.user._id,
        addresses: [req.body],
      };
      const newAddress = new userAddress(addressData);
      await newAddress.save();
    } else {
      await address.pushAddress(req.body);
      address.save();
    }
    res.status(200).json("Address added to database");
  } catch (err) {
    next(err);
  }
};

///get all addresses

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await userAddress.find({ userId: req.user._id });
    if (addresses == null) {
      res.status(400).json("No addresses");
    }
    res.status(200).json(addresses);
  } catch (err) {
    next(err);
  }
};

///remove address
export const removeAddress = async (req, res, next) => {
  try {
    const addressId = req.body.addressId;
    const address = await userAddress.findOne({ userId: req.user._id });
    address.removeAddress(addressId);
    address.save();
    res.status(200).json("Address removed");
  } catch (err) {
    next(err);
  }
};

///updateAddress
export const updateAddress = async (req, res, next) => {
  try {
    const addressId = req.body.addressId;
    const updateData = req.body;
    const address = await userAddress.findOne({ userId: req.user._id });
    address.updateAddress(addressId, updateData);
    address.save();
    res.status(200).json("Address updated");
  } catch (err) {
    next(err);
  }
};

//get product list
export const getProducts = async (req, res, next) => {
  try {
    let products = await product.find({});
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};
