import mongoose from "mongoose";

const iconsSchema = mongoose.Schema({
    path:{
        type:String,
        required:true
    }
})

const icons = mongoose.model("productIcons",iconsSchema)

export default icons