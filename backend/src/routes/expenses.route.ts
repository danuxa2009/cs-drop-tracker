import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  updateExpense,
} from '@/controllers/expenses.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/', createExpense);
router.delete('/:id', deleteExpense);
router.patch('/:id', updateExpense);
router.get('/', getAllExpenses);

export default router;
