import express from 'express';
import dotenv from 'dotenv';
import { externalRouter } from '@src/routes/external.js';
import { internalRouter } from '@src/routes/internal.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/user', externalRouter);
app.use("/internal/user", internalRouter);
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', service: 'auth-service' });
// });

// app.get('/users/count', async (req, res) => {
//   const count = await prisma.users.count();
//   res.json({ count });
// });

const PORT = process.env.USER_SERVICE_PORT || 8018;

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});