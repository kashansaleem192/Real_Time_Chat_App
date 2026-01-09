import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";    
import fileUpload from "express-fileupload";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import userRouter from "./routes/user.Routes.js";

const app = express();
config({  path: "./config/config.env" }); 


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,

}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
        }));

app.use("/api/v1/users", userRouter);

connectDB();

export default app;






