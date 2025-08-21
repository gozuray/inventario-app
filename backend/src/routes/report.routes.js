import { Router } from "express";
import { lowStockPDF } from "../controllers/product.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/low-stock", authRequired, lowStockPDF);

export default router;