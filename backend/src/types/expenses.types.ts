import { createExpenseSchema, updateExpenseSchema } from '@/validation/expenses.schema.js';
import z from 'zod';

export type ExpenseCategory = 'accounts' | 'proxy' | 'subscription' | 'other' | 'hardware';

export type CreateExpenseDTO = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDTO = z.infer<typeof updateExpenseSchema>;
