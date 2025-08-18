import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js"; // ⬅️ importa tus rutas

const app = express();
app.use(cors());
app.use(express.json());

// monta las rutas de auth
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;
