import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true, min: 0 },
  cantidad: { type: Number, required: true, min: 0 },
  categoria: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
