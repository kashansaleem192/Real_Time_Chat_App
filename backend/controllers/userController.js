import catchAsyncErrors from "../middlewares/catchAsyncError.middleware.js";
import {User} from "../models/usermodels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/JwtTokens.js";
import { v2 as cloudinary } from "cloudinary";


export const signUp = catchAsyncErrors(async (req, res, next) => {

    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide complete details",
        });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
    });

}
if (password.length < 8) {
    return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
    });
}
const userExists = await User.findOne({ email });
if (userExists) {
    return res.status(400).json({
        success: false,
        message: "User with this email already exists",
    }); 
}

const  hashedPassword  = await bcrypt.hash(password , 10);

const newUser = await User.create({
    fullname ,
    email,
    password : hashedPassword,
    avatar : {public_id : "" , url : ""}
})

generateToken(newUser , "User registered successfully" , 201 , res);

});
export const signIn = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email|| !password){
        return res.status(400).json({
            success : false,
            message : "Please provide email and password",
        });
        
    }
        const emailRegex = /^\S+@\S+\.\S+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
    });

}
const user = await User.findOne({ email }).select("+password");

if (!user){
    return res.status(400).json({
        success : false,
        message : "Invalid Credentials",
    });
}
const isPasswordMatched = await bcrypt.compare(password , user.password);
if (!isPasswordMatched){
    return res.status(400).json({
        success : false,
        message : "Invalid Credentials",
    });
}
generateToken(user, "User signed in successfully" , 200 , res);

})
export const signOut = catchAsyncErrors(async (req, res, next) => { 
   return res.status(200).cookie("token" , "" , {
    maxAge : 0,
  httpOnly : true,
  sameSite : "strict",
  secure : process.env.NODE_ENV === "production" ? true : false,

}).json({
    success : true,
    message : "User signed out successfully"
})
})
export const getUser = catchAsyncErrors(async (req, res, next) => {
const user = await User.findById(req.user._id);
return res.status(200).json({
    success : true,
    user,

});

})
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { fullname , email } = req.body;
if (!fullname || !email || !fullname.trim() || !email.trim())
{
        return res.status(400).json({
            success : false,
            message : "Please provide complete details",
        });
    }
    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};

    if(avatar){
       try{
        const oldAvatarPublicId = req.user?.avatar?.public_id;
        if(oldAvatarPublicId && oldAvatarPublicId.trim().length>0){
            await cloudinary.uploader.destroy(oldAvatarPublicId);

       } 
        cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath , {
            folder : "Chat_App_Avatars",
         transformation: [
  { width: 300, height: 300, crop: "limit", quality: "auto", fetch_format: "auto" }
]

        
        });
        
console.log("req.files:", req.files);
 console.log("Avatar file:", avatar);
console.log("Cloudinary Response:", cloudinaryResponse);

 
    }   catch(err){
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
            success : false,
            message : "Avatar upload failed",
        });
    
       }
    }

let data = {
    fullname,
    email,
};


if(avatar && cloudinaryResponse?.public_id){
    data.avatar = {
        public_id : cloudinaryResponse.public_id,
        url : cloudinaryResponse.secure_url,
    };
}

let user = await User.findByIdAndUpdate(req.user._id , data , {
    new : true,
    runValidators : true,
   
})
return res.status(200).json({
    success : true,
    message : "Profile updated successfully",
    user,
});
  

})