import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      default: ()=>{
        return "User" + Math.floor(Math.random() * 10000)
      },
    },
    mobile: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return !!(value || this.email);
        },
        message: "At least one of the mobile or email is requried",
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (value) {
          return !!(value || this.mobile);
        },
        message: "At least one of the mobile or email is requried",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("userdatas", userSchema);

export default User;
