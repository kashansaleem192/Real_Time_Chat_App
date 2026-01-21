import { config } from "dotenv";
import http from "http";
import { v2 as cloudinary } from "cloudinary";

import app from "./app.js";
import { connectDB } from "./Database/db.js";
import { initSocket } from "./Utils/socket.io.js";

config({ path: "./config/config.env" });

// 🔹 DB Connection (ONCE)
connectDB();

// 🔹 Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 HTTP + Socket
const server = http.createServer(app);
initSocket(server);

// 🔹 Server Listen
server.listen(process.env.PORT, () => {
    console.log(
        `Server running on http://localhost:${process.env.PORT}`
    );
});
