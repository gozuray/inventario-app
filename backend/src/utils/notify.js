// src/utils/notify.js
// Stub sencillo para que no falle el import.
// Más adelante aquí puedes agregar envío de email con Nodemailer, etc.
export async function notifyAdminsLowStock(product) {
  console.log(`[LOW-STOCK] ${product?.name} (qty: ${product?.quantity})`);
}
