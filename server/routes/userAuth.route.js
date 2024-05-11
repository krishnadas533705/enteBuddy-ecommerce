import { Router } from "express";
import { googleAuth, userAuth } from "../controllers/userAuth.controller.js";

const router = Router()

router.post('/userAuth',userAuth)
router.post('/googleAuth',googleAuth)

export default router