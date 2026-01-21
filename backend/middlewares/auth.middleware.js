import jwt from "jsonwebtoken";
import { User } from "../models/usermodels.js";
import catchAsyncErrors from "./catchAsyncError.middleware.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login to access this resource",
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again",
        });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found. Please login again",
        });
    }

    req.user = user;
    next();
});
