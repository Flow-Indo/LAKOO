import express, { type Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { externalRouter } from '@src/routes/external';
import { internalRouter } from '@src/routes/internal';
import { serviceAuthMiddleware } from '@shared/middleware/serviceAuthMiddleware';

dotenv.config();

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/user', externalRouter);
app.use('/internal', serviceAuthMiddleware, internalRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.USER_SERVICE_PORT || 3004;

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});

export default app;