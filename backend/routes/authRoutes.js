import { Router } from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";

const router = new Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;