import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './routes/webhook.routes';
import transactionRoutes from './routes/transaction.routes';
import adminRoutes from './routes/admin.routes';
import commissionRoutes from './routes/commission.routes';
import { PaymentRepository } from './repositories/payment.repository';
import { errorHandler } from './middleware/error-handler';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 8007;

app.disable('x-powered-by');

// Security headers
app.use(helmet());

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

// Capture raw body for webhook verification while still parsing JSON
app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Redirect root to API docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    docs: '/api-docs'
  });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/commissions', commissionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global Error Handler (handles AppError, Prisma, Zod errors)
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

const paymentRepo = new PaymentRepository();

const enableExpiration = process.env.ENABLE_EXPIRATION_CRON !== 'false';

if (enableExpiration) {
  const expirationSchedule = process.env.EXPIRATION_CRON_SCHEDULE || '0 * * * *';
  
  cron.schedule(expirationSchedule, async () => {
    console.log(`[${new Date().toISOString()}] Checking for expired payments...`);
    try {
      const result = await paymentRepo.expirePendingPayments();
      if (result.count > 0) {
        console.log(`Expired ${result.count} payments`);
      }
    } catch (error) {
      console.error('Expiration check failed:', error);
    }
  });
  
  console.log(`⏰ Payment expiration check scheduled: ${expirationSchedule}`);
}

server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Payment Service`);
  console.log(`Running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});
