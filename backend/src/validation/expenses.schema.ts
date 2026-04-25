import { DATE_REGEX } from '@/utils/constants.js';
import z from 'zod';

const expenseCategorySchema = z.enum(['accounts', 'proxy', 'subscription', 'other', 'hardware']);

export const createExpenseSchema = z.object({
  amount: z.number().nonnegative(),
  category: expenseCategorySchema,
  date: z.string().regex(DATE_REGEX),
  description: z.string().min(1),
});

export const updateExpenseSchema = createExpenseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
