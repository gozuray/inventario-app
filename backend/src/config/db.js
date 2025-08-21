import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/inventario_app";
    console.log("🔄 Intentando conectar a:", uri);
    
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado exitosamente");
    console.log("📊 Base de datos:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    throw error;
  }
};