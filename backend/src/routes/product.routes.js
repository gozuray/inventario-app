import { Router } from "express";
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  listLowStock
} from "../controllers/product.controller.js";
import { authRequired, isAdmin } from "../middleware/auth.js";

const router = Router();

// Rutas de productos
router.get("/", authRequired, getProducts);
router.post("/", authRequired, isAdmin, createProduct);
router.get("/low-stock", authRequired, listLowStock); // Para la lista de stock bajo en JSON
router.get("/:id", authRequired, getProductById);
router.put("/:id", authRequired, isAdmin, updateProduct);
router.delete("/:id", authRequired, isAdmin, deleteProduct);

export default router; // ✅ Exporta el router como default