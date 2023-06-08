const mongoose= require("mongoose");
const userSchema= mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    verified:{type:Boolean,default:false}
},{versionKey:false})

const userModel = mongoose.model("user",userSchema)
module.exports={userModel}