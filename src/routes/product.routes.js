import { Router } from "express";
import { list, create, update, remove } from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", requireAuth(), list);
router.post("/", requireAuth(["ADMIN"]), create);
router.put("/:id", requireAuth(["ADMIN"]), update);
router.delete("/:id", requireAuth(["ADMIN"]), remove);
export default router;
