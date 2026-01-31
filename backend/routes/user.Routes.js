import express from "express"
import { signUp, signIn, signOut, getUser, updateProfile } from "../controllers/userController.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.get("/sign-out",  isAuthenticated,signOut)
router.get("/me", isAuthenticated, getUser)
router.put("/updateprofile", isAuthenticated,updateProfile)
export default router
