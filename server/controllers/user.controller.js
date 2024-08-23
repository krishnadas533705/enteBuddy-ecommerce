import { response } from "express";
import { banner } from "../models/banner.model.js";
import cart from "../models/cart.model.js";
import coupon from "../models/coupons.model.js";
import order from "../models/order.model.js";
import product from "../models/product.model.js";
import reviews from "../models/review.model.js";
import { errorHandler } from "../utils/error.js";

let shipRocketAuthToken = null;

/// add a new item to the product
export const addToCart = async (req, res, next) => {
  try {
    if (req.user) {
      let discount = 0;
      if (req.body.discount) {
        discount = (req.body.price * req.body.discount) / 100;
      }
      const productData = {
        _id: req.body._id,
        productName: req.body.title,
        realPrice: req.body.price,
        price: req.body.price - discount,
      };
      if (req.body.realPrice) {
        productData.realPrice = req.body.realPrice;
      }
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
    let cartProducts = null;
    if (cartItems) {
      cartProducts = cartItems.items.map((item) => ({
        _id: item._id._id,
        primaryImage: item._id.primaryImage,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        realPrice: item.realPrice,
      }));
    }
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
    await cart.updateOne({ userId: userId }, { $set: { items: [] } });
    res.status(200).json("item removed from cart");
  } catch (err) {
    next(err);
  }
};

//get product list
export const getProducts = async (req, res, next) => {
  try {
    let products = await product.find({ quantity: { $gt: 0 } });
    let allReviews = await reviews.find({});
    let productMap = new Map();
    products.forEach((product) => {
      productMap.set(product._id.toString(), { ...product._doc, reviews: [] });
    });

    allReviews.forEach((review) => {
      let productIdStr = review.productId.toString();
      if (productMap.has(productIdStr)) {
        let productWithReviews = productMap.get(productIdStr);
        productWithReviews.reviews.push(...review.reviews);
      }
    });

    // If you need the products array updated with reviews
    products = Array.from(productMap.values());
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

///order management
//create new order
export const createOrder = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    // Construct the formatted current date string
    const formattedCurrentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const sellingPrice =
      req.body.paymentMethod == "Prepaid"
        ? req.body.sellingPrice / 100
        : req.body.sellingPrice;
    const orderDetails = {
      orderDate: formattedCurrentDate,
      billing_customer_name: req.body.name,
      billing_city: req.body.city,
      billing_pincode: req.body.pincode,
      billing_state: req.body.state,
      billing_email: req.body.email,
      billing_phone: req.body.mobile,
      billing_address: req.body.billing_address,
      paymentMethod:
        req.body.shippingMethod == "DTDC" ? "Prepaid" : req.body.paymentMethod,
      paymentId: req.body.paymentId,
      products: req.body.products,
      sellingPrice: sellingPrice,
      discount: req.body.discount,
      couponId: req.body.couponId ? req.body.couponId : undefined,
      shippingMethod: req.body.shippingMethod,
    };

    //pushing the order to database
    let existingOrder = await order.findOne({ userId: req.user._id });
    if (existingOrder) {
      existingOrder.orders.push(orderDetails);
      await existingOrder.save();
    } else {
      const newOrder = new order({
        userId: req.user._id,
        orders: [orderDetails],
      });
      await newOrder.save();
    }
    
    ///pushing order to shiprocket if shipping method is shiprocket
    //getting authtoken of shiprocket
    let responseText = "order placed";
    let responseStatus = 200;
    if (req.body.shippingMethod == "shiprocket") {
      const authToken = await generateShiprocketToken();

      const orders = req.body.products.map((item) => ({
        name: item.productName,
        units: item.quantity,
        sku: item._id,
        selling_price: item.price,
      }));

      ///get channel id
      let channelId = await fetch(
        "https://apiv2.shiprocket.in/v1/external/channels",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (channelId.ok) {
        const channelData = await channelId.json();
        channelId = channelData.data[0].id;
      }
      let newOrder = await order.findOne({ userId: req.user._id });
      newOrder = newOrder.orders[newOrder.orders.length - 1];
      const shipingData = {
        order_id: newOrder._id,
        order_date: newOrder.orderDate,
        pickup_location: "Primary",
        channel_id: channelId,
        company_name: "EnteBuddy",
        billing_customer_name: newOrder.billing_customer_name,
        billing_last_name: " ",
        billing_city: newOrder.billing_city,
        billing_pincode: newOrder.billing_pincode,
        billing_state: newOrder.billing_state,
        billing_country: "india",
        billing_email: newOrder.billing_email,
        billing_phone: newOrder.billing_phone,
        billing_address: newOrder.billing_address,
        shipping_is_billing: true,
        order_items: orders,
        payment_method: newOrder.paymentMethod,
        sub_total: newOrder.sellingPrice,
        length: "18",
        breadth: "16",
        height: "8",
        weight: ".490",
      };

      ///posting to shiprocket
      try {
        let shipingResponse = await fetch(
          "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(shipingData),
          }
        );
        if (shipingResponse.ok) {
          shipingResponse = await shipingResponse.json();
          //update shiprocketId in order collection
          await order.updateOne(
            { userId: req.user._id },
            {
              $set: {
                "orders.$[element].shipRocketOrderId": shipingResponse.order_id,
              },
            },
            { arrayFilters: [{ "element._id": newOrder._id }] }
          );

          //update used coupon
          if (req.body.couponId) {
            await coupon.updateOne(
              { _id: req.body.couponId },
              { $push: { usedBy: req.user._id } }
            );
          }
          //send response to client
          responseStatus = 200;
          responseText = "order placed successfully";
        } else {
          responseStatus = 500;
          responseText = "failed to ship order";
          await order.updateOne(
            { userId: req.user._id },
            { $pull: { orders: { _id: newOrder._id } } }
          );
        }
      } catch (err) {
        console.log("error in pushing to shiprocket : ", err);
      }
    }

    if (responseStatus == 200) {
      req.body.products.forEach((doc) => {
        (async () => {
          await product.updateOne(
            { _id: doc._id },
            { $inc: { quantity: -doc.quantity } }
          );
        })();
      });
    }

    res.status(responseStatus).send(responseText);
  } catch (err) {
    next(err);
  }
};

///check courirer service availability
export const checkPincode = async (req, res, next) => {
  try {
    const authToken = await generateShiprocketToken();
    const pincode = req.params.pincode;
    const pickup = 680681;
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?delivery_postcode=${pincode}&pickup_postcode=${pickup}&weight=5&cod=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const result = await response.json();
    let isAvailable = false;
    if (result.data && result.data.available_courier_companies.length > 0) {
      isAvailable = true;
    }
    res.status(200).json({ isAvailable });
  } catch (err) {
    next(err);
  }
};

///get order tracking details
export const getTrackingDetails = async (req, res, next) => {
  try {
    const authToken = await generateShiprocketToken();

    const orderId = req.params.orderId;
    let trackingDetails = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    trackingDetails = await trackingDetails.json();

    let trackingId = orderId + "";
    let trackingData = trackingDetails[0][trackingId]["tracking_data"];

    res.status(200).json(trackingData);
  } catch (err) {
    next(err);
  }
};

///fetch all offers
export const fetchOffers = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

///check coupon status and apply coupon
export const checkCoupon = async (req, res, next) => {
  try {
    const couponCode = req.params.couponCode;
    const couponStatus = await coupon.findOne({ couponCode: couponCode });
    let couponResponse;
    if (couponStatus) {
      let isUsed = couponStatus.usedBy.find((doc) => doc == req.user._id);
      if (!isUsed) {
        let startDate = new Date(couponStatus.startDate);
        let endDate = new Date(couponStatus.endDate);
        let today = new Date(Date.now());

        if (endDate > today && startDate <= today) {
          couponResponse = {
            isAvailable: true,
            discount: couponStatus.discount,
            couponId: couponStatus._id,
          };
        } else {
          couponResponse = {
            isAvailable: false,
            msg: "Coupon expired",
          };
        }
      } else {
        couponResponse = {
          isAvailable: false,
          msg: "Coupon not available",
        };
      }
    } else {
      couponResponse = { isAvailable: false, msg: "Invalid coupon" };
    }
    res.status(200).json(couponResponse);
  } catch (err) {
    next(err);
  }
};

///fetch all order details
export const fetchOrders = async (req, res, next) => {
  try {
    const allOrders = await order
      .findOne({ userId: req.user._id })
      .populate({ path: "orders.products._id", model: "products" });
    if (allOrders) {
      res.status(200).json({ orders: allOrders.orders });
    } else {
      res.status(200).json({ orders: null, msg: "No orders yet" });
    }
  } catch (err) {
    next(err);
  }
};

///review section
//add review
export const addReview = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const reviewData = {
      ...req.body,
      date: Date.now(),
      userId: req.user._id,
    };

    const productReview = await reviews.findOne({ productId: productId });
    if (productReview) {
      productReview.reviews.push(reviewData);
      await productReview.save();
    } else {
      const productReview = {
        productId: productId,
        reviews: [reviewData],
      };
      const newReview = new reviews(productReview);
      await newReview.save();
    }
    res.status(200).json(reviewData);
  } catch (err) {
    next(err);
  }
};

///fetch reviews
export const fetchReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const reviewData = await reviews.findOne({ productId: productId });
    let response = [];
    if (reviewData) {
      response = { reviews: reviewData.reviews };
    }
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

//get banner
export const getBanners = async (req, res, next) => {
  try {
    const allBanners = await banner.find({});
    const currentBanner = allBanners[allBanners.length - 1];

    res.status(200).json(currentBanner);
  } catch (err) {
    next(err);
  }
};

///fetch shiprocket token

const generateShiprocketToken = async () => {
  try {
    if (
      !shipRocketAuthToken ||
      Date.now() - shipRocketAuthToken.timeStamp > 5 * 24 * 60 * 60 * 1000
    ) {
      const credentials = {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      };
      let loginResponse = await fetch(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      loginResponse = await loginResponse.json();
      shipRocketAuthToken = {
        token: loginResponse.token,
        timeStamp: new Date(Date.now()),
      };
    }

    return shipRocketAuthToken.token;
  } catch (err) {
    console.log("Error in generating shiprocket token : ", err);
  }
};
