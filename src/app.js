// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();

// === CORS ===
const ALLOWED_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:4200'; // ajusta a tu front real

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Content-Disposition'], // para descargar PDF con nombre
  credentials: true,
  maxAge: 86400
}));
// responde preflight
app.options('*', cors());

// === Seguridad / utilidades ===
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// === Healthcheck ===
app.get('/health', (_req, res) => res.json({ ok: true }));

// === Rutas API ===
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reports', reportRoutes);

// === 404 / errores ===
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return res.status(404).json({ message: `No encontrado: ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Error interno' });
});

export default app;
