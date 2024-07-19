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
      console.log("Adding to cart....", req.body);
      const discount = 0;
      if (req.body.discount) {
        const discount = (req.body.price * req.body.discount) / 100;
      }
      const productData = {
        _id: req.body._id,
        productName: req.body.title,
        price: req.body.price - discount,
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
    console.log("2", cartItems);
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
    await cart.updateOne({ userId: userId }, { $set: { items: [] } });
    res.status(200).json("item removed from cart");
  } catch (err) {
    next(err);
  }
};

//get product list
export const getProducts = async (req, res, next) => {
  try {
    let products = await product.find({});
    let allReviews = await reviews.find({});
    let productMap = new Map();
    products.forEach((product) => {
      productMap.set(product._id.toString(), { ...product._doc, reviews: [] });
    });

    allReviews.forEach((review) => {
      let productIdStr = review.productId.toString();
      if (productMap.has(productIdStr)) {
        console.log("id matched ");
        let productWithReviews = productMap.get(productIdStr);
        console.log("reviews : ", review.reviews);
        productWithReviews.reviews.push(...review.reviews);
        console.log("productWith reviws : ", productWithReviews);
      }
    });

    // If you need the products array updated with reviews
    products = Array.from(productMap.values());
    console.log("products : ", product);
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
    console.log("shipping product : ", req.body.products);
    const orderDetails = {
      orderDate: formattedCurrentDate,
      billing_customer_name: req.body.name,
      billing_city: req.body.city,
      billing_pincode: req.body.pincode,
      billing_state: req.body.state,
      billing_email: req.body.email,
      billing_phone: req.body.mobile,
      billing_address: req.body.billing_address,
      paymentId: req.body.paymentId,
      products: req.body.products,
      sellingPrice: req.body.sellingPrice / 100,
      discount: req.body.discount,
      couponId: req.body.couponId ? req.body.couponId : undefined,
    };

    //pushing the order to database
    let existingOrder = await order.findOne({ userId: req.user._id });
    if (existingOrder) {
      console.log("existing user true");
      existingOrder.orders.push(orderDetails);
      await existingOrder.save();
    } else {
      console.log("Creating new order");
      const newOrder = new order({
        userId: req.user._id,
        orders: [orderDetails],
      });
      await newOrder.save();
    }

    ///pushing order to shiprocket
    //getting authtoken of shiprocket

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
    console.log("Channel id : ", channelId);
    if (channelId.ok) {
      console.log("Channel id ok : ", channelId);

      const channelData = await channelId.json();
      channelId = channelData.data[0].id;
    }
    console.log("channel id : ", channelId);
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
      payment_method: "Prepaid",
      sub_total: newOrder.sellingPrice,
      length: "5",
      breadth: "5",
      height: "5",
      weight: "10",
    };

    console.log("Pushing to shiprocket....");
    console.log(shipingData);
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
        console.log("shiping success");
        shipingResponse = await shipingResponse.json();
        //update shiprocketId in order collection
        await order.updateOne(
          { userId: req.user._id },
          {
            $set: {
              "orders.$[element].shipRocketOrderId": shipingResponse.id,
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
        res.status(200).send("order placed successfully");
      } else {
        res.status(500).send("failed to ship order");
        console.log("Failed to ship order : ", await shipingResponse.json());
      }
    } catch (err) {
      console.log("error in pushing to shiprocket : ", err);
    }
  } catch (err) {
    next(err);
  }
};

///check courirer service availability
export const checkPincode = async (req, res, next) => {
  try {
    console.log("checking pincode....");
    console.log("postcode : ", req.params.pincode);
    const authToken = await generateShiprocketToken();
    console.log("Authtoken : ", authToken);
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
    console.log("Result : ", result);
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
    let trackingData;
    if (trackingDetails.length > 0) {
      trackingData = {
        ...trackingDetails,
        shipped: true,
      };
    } else {
      trackingData = {
        shipped: false,
      };
    }
    console.log("Tracking datails : ", trackingDetails);
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
      console.log("isUsed : ", isUsed);
      if (!isUsed) {
        let startDate = new Date(couponStatus.startDate);
        let endDate = new Date(couponStatus.endDate);
        let today = new Date(Date.now());

        console.log("start Date ", startDate);
        console.log("end Date : ", endDate);
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
      console.log("Orders : ", allOrders.orders[0].products);
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
    console.log("allbanners : ", allBanners);
    console.log("current banner : ", currentBanner);
    res.status(200).json(currentBanner);
  } catch (err) {
    next(err);
  }
};

///fetch shiprocket token

const generateShiprocketToken = async () => {
  try {
    console.log("fetching token");
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
      console.log("login response : ", loginResponse);
      shipRocketAuthToken = {
        token: loginResponse.token,
        timeStamp: new Date(Date.now()),
      };
      console.log("New shiprocket token : ", shipRocketAuthToken);
    } else {
      console.log("old token is valid");
    }

    return shipRocketAuthToken.token;
  } catch (err) {
    console.log("Error in generating shiprocket token : ", err);
  }
};
