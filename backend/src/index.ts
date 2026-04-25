import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionsRouter from './routes/sessions.route.js';
import expensesRouter from './routes/expenses.route.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/sessions', authMiddleware, sessionsRouter);
app.use('/api/expenses', authMiddleware, expensesRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    path: req.path,
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

  const { startUserbot } = await import('./bot/userbot.js');

  void startUserbot().catch((error) => {
    console.error('Failed to start Telegram userbot', error);
  });
});
