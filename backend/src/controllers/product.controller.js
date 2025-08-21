// controllers/product.controller.js

import Product from "../models/Product.js";              // Modelo de Mongoose para productos
import { notifyAdminsLowStock } from "../utils/notify.js"; // Utilidad para notificar (p. ej. email/log)
import PDFDocument from "pdfkit";                        // Librería para generar PDFs

// Función auxiliar: si la cantidad es baja (<5), dispara notificación
const maybeNotifyLowStock = async (p) => {
  if (p.quantity < 5) {
    await notifyAdminsLowStock(p);
  }
};

// Crea un producto (ADMIN)
// - Valida por esquema (min: 0) y, si queda en bajo stock, notifica
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    const product = await Product.create({ name, description, price, quantity, category });
    await maybeNotifyLowStock(product);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message }); // errores de validación, etc.
  }
};

// Lista productos con filtros y paginación (ADMIN/EMPLEADO)
// GET /api/products?name=abc&category=cat&page=1&limit=20
export const getProducts = async (req, res) => {
  try {
    const { name, category, page = 1, limit = 20 } = req.query;

    // Construcción dinámica del filtro
    const q = {};
    if (name) q.name = { $regex: name, $options: "i" };
    if (category) q.category = { $regex: category, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    // Just return the array of items
    const items = await Product.find(q).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    
    res.json(items); // ← Return only the array

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Obtiene producto por ID (ADMIN/EMPLEADO)
export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: "No encontrado" });
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message }); // ID mal formado u otros
  }
};

// Actualiza un producto (ADMIN)
// - Valida que quantity no sea negativa
// - Si después de actualizar queda en bajo stock, notifica
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    // Validación específica de negocio, además del min:0 del esquema
    if (typeof updates.quantity === "number" && updates.quantity < 0) {
      return res.status(400).json({ msg: "Cantidad no puede ser negativa" });
    }

    const p = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ msg: "No encontrado" });

    await maybeNotifyLowStock(p);
    res.json(p);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Elimina un producto (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ msg: "No encontrado" });
    res.json({ msg: "Eliminado" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// --- Low stock list (JSON)
// Devuelve todos los productos con quantity < 5, ordenados ascendente por cantidad
export const listLowStock = async (req, res) => {
  try {
    const items = await Product.find({ quantity: { $lt: 5 } }).sort({ quantity: 1 });
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// --- Low stock PDF (stream)
// Genera un PDF en streaming con el listado de bajo stock
export const lowStockPDF = async (req, res) => {
  try {
    const items = await Product.find({ quantity: { $lt: 5 } }).sort({ quantity: 1 });

    // Encabezados para indicar que la respuesta es un PDF que se muestra inline
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="low-stock.pdf"');

    // Crear documento y canalizarlo (pipe) a la respuesta HTTP
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    // Título y metadatos básicos
    doc.fontSize(18).text("Reporte de Inventario Bajo", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generado: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Contenido
    if (items.length === 0) {
      doc.text("No hay productos con inventario bajo (< 5).");
    } else {
      items.forEach((p, i) => {
        doc.text(`${i + 1}. ${p.name} | Cat: ${p.category} | Qty: ${p.quantity} | $${p.price}`);
      });
    }

    doc.end(); // Finalizar el stream del PDF
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
