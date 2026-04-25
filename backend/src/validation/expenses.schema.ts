import { DATE_REGEX } from '@/utils/constants.js';
import z from 'zod';

const expenseCategorySchema = z.enum(['accounts', 'proxy', 'subscription', 'other', 'hardware']);

export const createExpenseSchema = z.object({
  amount: z.number().nonnegative(),
  category: expenseCategorySchema,
  date: z.string().regex(DATE_REGEX),
  description: z.string().min(1),
});

export const updateExpenseSchema = z.object({
  amount: z.number().nonnegative().optional(),
  category: expenseCategorySchema.optional(),
  date: z.string().regex(DATE_REGEX).optional(),
  description: z.string().min(1).optional(),
});

export const deleteExpenseSchema = z.object({
  id: z.number(),
});
