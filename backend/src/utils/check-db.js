import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const checkDatabase = async () => {
  try {
    await connectDB();
    
    console.log("🔍 Verificando datos en la base de datos...\n");
    
    // Verificar usuarios
    const users = await User.find({});
    console.log("👥 USUARIOS ACTUALES:");
    console.log(`Total: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log("\n📦 PRODUCTOS ACTUALES:");
    const products = await Product.find({});
    console.log(`Total: ${products.length}`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} - Stock: ${product.quantity}`);
    });
    
    console.log("\n📊 ESTADÍSTICAS:");
    console.log(`Base de datos: ${mongoose.connection.name}`);
    console.log(`Conexión: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Listar todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n📋 COLECCIONES EN LA BASE DE DATOS:");
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error verificando la base de datos:", error);
    process.exit(1);
  }
};

checkDatabase();