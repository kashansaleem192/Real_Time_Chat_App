import express from "express"
import { signUp, signIn, signOut, getUser, updateProfile } from "../controllers/userController.js"
const router = express.Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.post("/signout", signOut)
router.get("/me", getUser)
router.put("/updateprofile", updateProfile)
export default router
