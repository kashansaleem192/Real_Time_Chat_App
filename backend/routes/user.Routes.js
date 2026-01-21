import express from "express"
import { signUp, signIn, signOut, getUser, updateProfile } from "../controllers/userController.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.get("/signout",  isAuthenticated,signOut)
router.get("/me", isAuthenticated, getUser)
router.put("/updateprofile", isAuthenticated,updateProfile)
export default router
