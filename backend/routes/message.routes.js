import express from "express"
import { getAllUSers , getMessages , sendMessages } from "../controllers/message.Controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/users" , isAuthenticated , getAllUSers);

router.get("/:id", isAuthenticated , getMessages);
router.post("/send/:id", isAuthenticated, sendMessages);



export default router; 