import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import { User } from "../models/usermodels.js";
import {Message } from "../models/message.model.js"
import {v2 as cloudinary}  from "cloudinary"
import { getReceiverSocketId, io } from "../Utils/socket.io.js";
export const getAllUSers = catchAsyncError(async(req , res , next) => {
    const user = req.user._id
    const filteredUsers = await User.find ({ _id :{$ne : user} }).select("-password")
    res.status(200).json({
        success : true ,
    users: filteredUsers,
    });
});


export const getMessages = catchAsyncError(async(req , res , next) => {   
    const recevierId = req.params.id;
    const myId = req.user._id;
    const  recevier = await User.findById(recevierId);

    if(!recevier){
        return res.status(400).json ({
            success : false,
            message : "Recevier ID Invalid",
        });
    }
    const message  = await Message.find({$or:[
        {senderId:myId , recevierId:recevierId},
        {senderId:recevierId,recevierId:myId}
    ] 
}).sort({createdAt:1});

res.status(200).json({
    success:true,
    message,
});
});
export const sendMessages = catchAsyncError(async(req , res , next) => {
    const {text} = req.body;
    const media = req?.files?.media;
    const {id: recevierId} = req.params
    const senderId = req.user._id;

     const  recevier = await User.findById(recevierId);

    if(!recevier){
        return res.status(400).json ({
            success : false,
            message : "Recevier ID Invalid",
        });
    }

    const sanitizedText = text?.trim()|| ""
    if(!sanitizedText && !media ){
        return res.status(400).json({
            success:false,
            message:"Cannot send empty message"
        })
    }

    let mediaUrl  = ""
    if(media){
        try{
        const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath , {
            resource_type : "auto",
            folder : "CHAT_APP_MEDIA",
            transformation : [
                {width: 1080, height :1080, crop : "limit"},
                {quality: "auto"},
                { fetch_format : "auto"}
            ],

        }
    )
    mediaUrl= uploadResponse?.secure_url
    } catch(err){
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
            success : false,
            message : "Failed to Upload Media",
        });
    
       }
    }

    const newMessage = await Message.create({
        senderId,
        recevierId,
        text : sanitizedText,
        media: mediaUrl
    });

    const recevierSocketId = getReceiverSocketId(recevierId);
if(recevierSocketId)
{
    io.to(recevierSocketId).emit("newMessage" , newMessage)
}

res.status(201).json(newMessage);
})