import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId : {type : mongoose.Schema.Types.ObjectId , ref:  "User", required: true},
    recevierId : {type : mongoose.Schema.Types.ObjectId , ref:  "User", required: true},
    text:String,
    media :String,
   
   
} ,{timestamps: true}
)
export const Message = mongoose.model("Message", messageSchema);