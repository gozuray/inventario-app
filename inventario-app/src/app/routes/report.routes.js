// routes/report.routes.js
import { Router } from 'express';
import { generateLowStockPdfStream } from '../services/pdf.service.js';

const router = Router();

router.get('/low-stock', async (_req, res, next) => {
  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="inventario-bajo.pdf"');
    const stream = await generateLowStockPdfStream(); // devuelve Readable
    stream.pipe(res);
  } catch (e) { next(e); }
});

export default router;
