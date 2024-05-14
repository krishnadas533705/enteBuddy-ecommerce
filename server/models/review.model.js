import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdatas",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const reviews = mongoose.model("reviews", reviewSchema);
export default reviews;
