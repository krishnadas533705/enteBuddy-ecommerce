import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userdatas",
  },
  orders: [
    {
      products: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'products',
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
        },
      ],
      orderDate: {
        type: Date,
        required: true,
      },
      orderStatus: {
        type: String,
        default: "Order placed",
      },
      paymentMethod:{
        type:String,
        required:true
      },
      paymentId: {
        type: String,
        required: false,
      },
      billing_customer_name: {
        type: String,
        required: true,
      },
      billing_address: {
        type: String,
        required: true,
      },
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
      shipRocketOrderId: {
        type: Number,
        required: false,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: false,
      },
      refundId: {
        type: String,
        requried: false,
      },
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupons",
        required: false,
      },
      shippingMethod:{
        type:String,
        requried:true
      }
    },
  ],
});

orderSchema.methods.newOrder = function (orderDetails) {
  try {
    this.orders.push(orderDetails);
    this.totalPurchase += orderDetails.price;
  } catch (err) {
    console.log("New order error : ", err);
  }
};

const order = mongoose.model("orderDetails", orderSchema);
export default order;
