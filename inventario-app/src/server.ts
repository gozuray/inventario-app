// src/server.ts
import 'zone.js/node';
import express from 'express';
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';

const app = express();
const angularApp = new AngularNodeAppEngine();

// (tus middlewares antes, si los hay)

// Catch-all SIN ruta
app.use(async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
});

// ¡exporta el handler que espera el CLI!
export const reqHandler = createNodeRequestHandler(app);
