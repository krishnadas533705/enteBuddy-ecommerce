import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required:true
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    usedBy:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'userdatas'
    }]
  },
  { timestamps: true }
);

const coupon = mongoose.model("coupons", couponSchema);
export default coupon;
