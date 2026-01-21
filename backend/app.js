import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";

import userRouter from "./routes/user.Routes.js";
import messageRouter from "./routes/message.routes.js";

config({ path: "./config/config.env" });

const app = express();

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
}));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// Global error middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

export default app;
