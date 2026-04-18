import { Request, Response } from 'express';
import * as sessionsRepository from '../repositories/sessions.repository.js';
import { createSessionSchema, updateSessionSchema } from '@/validation/session.schema.js';

export async function createSession(req: Request, res: Response) {
  const result = createSessionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', errors: result.error.issues });
    return;
  }

  try {
    const session = await sessionsRepository.upsertSession(result.data);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
}

export async function getAllSessions(_req: Request, res: Response) {
  try {
    const sessions = await sessionsRepository.getAllSessions();
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to get sessions' });
  }
}

export async function getSessionById(req: Request, res: Response) {
  try {
    const session = await sessionsRepository.getSessionById(Number(req.params.id));
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get session' });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    const session = await sessionsRepository.deleteSession(Number(req.params.id));
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
}

export async function updateSession(req: Request, res: Response) {
  const result = updateSessionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', errors: result.error.issues });
    return;
  }

  try {
    const session = await sessionsRepository.updateSession(Number(req.params.id), result.data);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update session' });
  }
}
