import product from "../models/product.model.js"
import { instance } from "../index.js"
import crypto from 'crypto'
import { errorHandler } from "../utils/error.js"



export const createOrder = async (req,res,next)=>{
    try{
        const productId = req.body.productId
        const productDetails = await product.findById(productId)
        const amount = productDetails.price - (productDetails.price * productDetails.discount/100)
        console.log("Amount : ",amount)
        const options = {
            amount:amount*100,
            currency:'INR',
        }

        const order = await instance.orders.create(options)
        order.amount = amount
        res.status(200).json({order,key_id:process.env.RAZORPAY_ID,message:"Order created"})
    }
    catch(err){
        next(err)
    }
}


export const verifyPayment = async (req,res,next)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" +razorpay_payment_id
        

        const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET_KEY).update(body.toString()).digest('hex')
        if(expectedSignature == razorpay_signature){
            //database 
            // redirect to front end or send success response
        }
        else{
            return errorHandler(400,"payment verification failed")
        }
        
    }
    catch(err){
        next(err)
    }
}