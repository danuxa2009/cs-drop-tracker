import { Router } from 'express';
import {
  createSession,
  deleteSession,
  getAllSessions,
  getSessionById,
  updateSession,
} from '@/controllers/sessions.controller.js';

const router = Router();

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);
router.patch('/:id', updateSession);

export default router;
