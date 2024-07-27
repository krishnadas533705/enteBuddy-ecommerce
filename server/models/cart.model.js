import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userdatas",
  },
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
      },
      realPrice:{
        type:Number
      }
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

cartSchema.methods.addProduct = function (product) {
  try {
    const existingPrductIndex = this.items.findIndex(
      (item) => item._id == product._id
    );
    if (existingPrductIndex != -1) {
      this.items[existingPrductIndex].quantity++;
    } else {
      this.items.push(product);
    }

    this.totalPrice += product.price;
    return;
  } catch (err) {
    console.log("error in adding item to cart : ", err);
  }
};

cartSchema.methods.removeFromCart = function (productId) {
  try {
    const cartItems = this.items.filter((item) => item._id != productId);
    this.items = cartItems;
    return;
  } catch (err) {
    console.log("error in removing item from cart : ", err);
  }
};

const cart = mongoose.model("cartItems", cartSchema);
export default cart;
