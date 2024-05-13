import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      default: () => {
        return "User" + Math.floor(Math.random() * 10000);
      },
    },
    mobile: {
      type: String,
      unique: true,
      requried: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("userdatas", userSchema);

export default User;
