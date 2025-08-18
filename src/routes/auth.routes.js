import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/register", requireAuth(["ADMIN"]), register);
router.post("/login", login);
export default router;
