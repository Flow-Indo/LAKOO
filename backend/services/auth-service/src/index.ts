import express from 'express';
import dotenv from 'dotenv';
import { router } from '@src/routes/index'
import passport from 'passport';
import './config/passport';

dotenv.config();

const app = express();
app.use(express.json());

app.use(passport.initialize());
app.use('/', router)

// app.get('/users/count', async (req, res) => {
//   const count = await prisma.users.count();
//   res.json({ count });
// });

const PORT = process.env.AUTH_SERVICE_PORT || 8001;

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});