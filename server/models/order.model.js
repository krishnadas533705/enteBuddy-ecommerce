import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userdatas",
  },
  orders: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      orderDate: {
        type: Date,
        required: true,
      },
      orderStatus: {
        type: String,
        default: "Order placed",
      },
      paymentId: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
      },
    },
  ],
  billing_city: {
    type: String,
    required: true,
  },
  billing_state: {
    type: String,
    required: true,
  },
  billing_pincode: {
    type: Number,
    required: true,
  },
  billing_email: {
    type: String,
    requried: true,
  },
  billing_phone: {
    type: Number,
    required: true,
  },
  totalPurchase: {
    type: Number,
    default: 0,
  },
  shipRocketOrderId: {
    type: Number,
    required: false,
  },
});

orderSchema.methods.newOrder = function (orderDetails) {
  try {
    this.orders.push(orderDetails);
    this.totalPurchase += orderDetails.price;
  } catch (err) {
    console.log("New order error : ", err);
  }
};

//pushing order to shiprocket
orderSchema.post("save", async (doc, next) => {
  try {
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
        body: credentials,
      }
    );

    loginResponse = await loginResponse.json();
    const authToken = loginResponse.token;

    const orders = doc.orders.map((item) => ({
      name: item.productName,
      units: item.quantity,
      sku: item.productId,
      sellingPrice: item.price,
    }));

    const totalPrice = doc.orders.reduce(
      (price, item) => price + item.price,
      0
    );
    const shipingData = {
      order_id: doc._id,
      order_date: doc.orderDate,
      pickup_location: "Primary",
      channel_id: "4994371",
      company_name: "EnteBuddy",
      billing_customer_name: "adithya",
      billing_isd_code: "654789",
      billing_city: "kottayam",
      billing_pincode: "645789",
      billing_state: "kerala",
      billing_country: "india",
      billing_email: "adithya@gmail.com",
      billing_phone: "9746857346",
      billing_alternate_phone: "",
      shipping_is_billing: true,
      order_items: orders,
      payment_method: "Prepaid",
      sub_total: totalPrice,
      length: "5",
      breadth: "5",
      height: "5",
      weight: "10",
    };

    const shipingResponse = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorisation: "Bearer " + authToken,
        },
        body: JSON.stringify(shipingData),
      }
    );

    if (shipingResponse.ok) {
      shipingResponse = await shipingResponse.json();
      console.log("order placed to shiprocket");
      await order.updateOne(
        { _id: doc._id },
        { $set: { shipRocketOrderId: shipingResponse.order_id } }
      );
    } else {
      console.log("Failed to ship order");
      throw new Error("Failed to ship order");
    }
  } catch (err) {
    console.log("Error in pushing to shiprocket : ", err);
  }
});

const order = mongoose.model("orderDetails", orderSchema);
export default order;
