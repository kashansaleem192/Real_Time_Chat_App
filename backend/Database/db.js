import mongoose from "mongoose";
export const connectDB =  () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_Chat_App"})
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.log(`Database connection failed  ${err.message|| err}`);
            
        }); 

    }
