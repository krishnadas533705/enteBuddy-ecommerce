import { Router } from "express";
import { googleAuth, logoutUser, userAuth } from "../controllers/userAuth.controller.js";
import { verifyUser } from "../utils/authorisation.js";

const router = Router()

router.post('/userAuth',userAuth)
router.post('/googleAuth',googleAuth)

//logout
router.post('/signout/:userId',verifyUser,logoutUser)

export default router