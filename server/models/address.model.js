import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "userdatas",
    },
    addresses: [
      {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        locality: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: Number,
          required: true,
        },
        phone: {
          type: Number,
          required: true,
        },
        defaultAddress: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

addressSchema.methods.pushAddress = function (address) {
  try {
    if (address.defaultAddress) {
      console.log("changing defaultAddress");
      const defaultAddress = this.addresses.find(
        (addr) => addr.defaultAddress == true
      );
      defaultAddress.defaultAddress = false;
    }
    console.log("Pushing new address.....");
    this.addresses.push(address);
  } catch (err) {
    console.log("Address error : ", err);
  }
};

addressSchema.methods.removeAddress = function (addressId) {
  try{
    const newAddresses = this.addresses.filter((addr)=> addr._id != addressId)
    this.addresses = newAddresses
    return
  }
  catch(err){
    console.log("Address error : ",err)
  }
}


addressSchema.methods.updateAddress = function (addressId,updateData){
  try{
    const address = this.addresses.find((addr)=> addr._id == addressId)
    console.log("ADDRESS : ",address)
    for(const key in updateData){
      if(updateData.hasOwnProperty(key) && (key in address)){
        console.log("condition true : ")  
        address[key] = updateData[key]
      }
    }
    console.log(address)
    return
  }
  catch(err){
    console.log("Address error : ",err)
  }
}

const userAddress = mongoose.model("userAddresses", addressSchema);

export default userAddress;
