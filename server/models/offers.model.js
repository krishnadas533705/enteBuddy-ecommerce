import mongoose from "mongoose";

const offerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const offers = mongoose.model("offers", offerSchema);
export default offers;
