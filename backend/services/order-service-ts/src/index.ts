import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error-handler';
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 3006;

app.disable('x-powered-by');

app.use(helmet());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'order-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    docs: '/api-docs'
  });
});

app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global Error Handler
app.use(errorHandler);

// Graceful shutdown
let server: ReturnType<typeof app.listen> | undefined;
const closeServer = () =>
  new Promise<void>((resolve, reject) => {
    if (!server) return resolve();
    server.close((err?: Error) => {
      if (err) return reject(err);
      resolve();
    });
  });

const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server gracefully...');

  const forcedExitTimer = setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);

  try {
    await closeServer();
    console.log('HTTP server closed');
  } catch (err) {
    console.error('Error closing HTTP server:', err);
  }

  try {
    await prisma.$disconnect();
    console.log('Prisma disconnected');
  } catch (err) {
    console.error('Error disconnecting Prisma:', err);
  } finally {
    clearTimeout(forcedExitTimer);
  }

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Order Service');
  console.log(`Running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});
