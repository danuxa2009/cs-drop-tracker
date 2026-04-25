import { Request, Response } from 'express';
import * as expensesRepository from '@/repositories/expenses.repository.js';
import { createExpenseSchema, updateExpenseSchema } from '@/validation/expenses.schema.js';

export async function createExpense(req: Request, res: Response) {
  const result = createExpenseSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', errors: result.error.issues });
    return;
  }

  try {
    const expense = await expensesRepository.createExpense(result.data);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Failed to create expense' });
  }
}

export async function getAllExpenses(_req: Request, res: Response) {
  try {
    const expenses = await expensesRepository.getAllExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const expense = await expensesRepository.deleteExpense(Number(req.params.id));
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
}

export async function updateExpense(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = updateExpenseSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Invalid request body', errors: result.error.issues });
    return;
  }

  try {
    const updatedExpense = await expensesRepository.updateExpense(id, result.data);
    if (!updatedExpense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
}
