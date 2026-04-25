import { NextFunction, Request, Response } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('X-API-Key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  next();
}
