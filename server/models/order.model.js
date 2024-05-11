import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"userdatas"
    },
    orders:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        productName:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        orderDate:{
            type:Date,
            required:true
        },
        orderStatus:{
            type:String,
            default:"Order placed"
        },
        paymentId:{
            type:String,
            required:true
        },
        updatedAt:{
            type:Date,
            required:true
        }
    }],
  totalPurchase:{
    type:Number,
    default:0
  }  
})


orderSchema.methods.newOrder = function(orderDetails){
    try{
        this.orders.push(orderDetails)
        this.totalPurchase += orderDetails.price
    }
    catch(err){
        console.log("New order error : ",err)
    }
}

const orders = mongoose.model("orderDetails",orderSchema)
orderSchema.methods.newOrder.bind(orders)
export default orders