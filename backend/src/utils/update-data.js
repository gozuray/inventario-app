import "dotenv/config";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const updateData = async () => {
  try {
    await connectDB();
    
    console.log("🔄 Actualizando datos...");
    
    // Ejemplo: Actualizar un producto por nombre
    const productUpdate = await Product.findOneAndUpdate(
      { name: "Laptop Dell" }, // Filtro
      { 
        name: "Laptop Dell Inspiron",
        price: 850,
        quantity: 10,
        description: "Laptop renovada para oficina"
      },
      { new: true } // Retorna el documento actualizado
    );
    
    if (productUpdate) {
      console.log("✅ Producto actualizado:", productUpdate.name);
    }
    
    // Ejemplo: Actualizar múltiples productos
    const bulkUpdate = await Product.updateMany(
      { quantity: { $lt: 5 } }, // Productos con stock menor a 5
      { $set: { lowStock: true } }
    );
    
    console.log(`✅ ${bulkUpdate.modifiedCount} productos marcados como stock bajo`);
    
    // Ejemplo: Incrementar precio de una categoría
    const priceIncrease = await Product.updateMany(
      { category: "Electrónicos" },
      { $inc: { price: 50 } } // Aumenta $50 a todos los electrónicos
    );
    
    console.log(`✅ ${priceIncrease.modifiedCount} productos con precio actualizado`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error actualizando datos:", error);
    process.exit(1);
  }
};

updateData();