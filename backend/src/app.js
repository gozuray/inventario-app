import express from "express";
import cors from "cors";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoints de prueba
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Montar las rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reports", reportRoutes);

export default app;