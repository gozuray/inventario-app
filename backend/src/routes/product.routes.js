import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { authRequired, isAdmin } from "../middleware/auth.js";

const router = Router();

// Solo admin puede crear/editar/eliminar
router.post("/", authRequired, isAdmin, createProduct);
router.get("/", authRequired, getProducts);
router.put("/:id", authRequired, isAdmin, updateProduct);
router.delete("/:id", authRequired, isAdmin, deleteProduct);

export default router;
