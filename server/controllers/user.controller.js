import userAddress from "../models/address.model.js";
import cart from "../models/cart.model.js";
import order from "../models/order.model.js";
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
      console.log("2",cartItems)
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
    console.log("shipping body : ", req.body);
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
    const authToken = loginResponse.token;

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
        console.log("order placed to shiprocket");
        await order.updateOne(
          { userId: req.user._id },
          {
            $set: {
              "orders.$[element].shipRocketOrderId": shipingResponse.order_id,
            },
          },
          { arrayFilters: [{ "element._id": newOrder._id }] }
        );
        res.status(200).send("order placed successfully");
      } else {
        res.status(500).send("failed to ship order")
        console.log("Failed to ship order : ", await shipingResponse.json());
      }
    } catch (err) {
      console.log("error in pushing to shiprocket : ", err);
    }
  } catch (err) {
    next(err);
  }
};
