import catchAsyncErrors from "../middlewares/catchAsyncError.middleware.js";
import {User} from "../models/usermodels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/JwtTokens.js";
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
export const signIn = catchAsyncErrors(async (req, res, next) => {})
export const signOut = catchAsyncErrors(async (req, res, next) => {})
export const getUser = catchAsyncErrors(async (req, res, next) => {})
export const updateProfile = catchAsyncErrors(async (req, res, next) => {})