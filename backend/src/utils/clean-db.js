import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";

const cleanDatabase = async () => {
  try {
    await connectDB();
    
    console.log("🧹 Limpiando base de datos...");
    
    // Obtener todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log("📋 Colecciones encontradas:");
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Eliminar todas las colecciones
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`✅ Eliminada colección: ${collection.name}`);
    }
    
    console.log("\n🎉 Base de datos completamente limpia");
    console.log("💡 Ahora puedes ejecutar el seeder para crear datos frescos");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error limpiando la base de datos:", error);
    process.exit(1);
  }
};

cleanDatabase();