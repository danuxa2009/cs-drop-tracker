import { DATE_REGEX } from '@/utils/constants.js';
import { z } from 'zod';

const sessionDropSchema = z.object({
  case_name: z.string().min(1),
  amount: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
});

const sessionSkinSchema = z.object({
  skin_name: z.string().min(1),
  amount: z.number().int().positive(),
  price: z.number().positive(),
});

export const createSessionSchema = z.object({
  date_from: z.string().regex(DATE_REGEX),
  date_to: z.string().regex(DATE_REGEX),
  accounts_count: z.number().int().positive(),
  total_value: z.number().nonnegative(),
  total_cases: z.number().int().positive(),
  avg_case_price: z.number().nonnegative(),
  avg_drop_price: z.number().nonnegative(),
  is_final: z.boolean().optional(),
  notes: z.string().optional(),
  drops: z.array(sessionDropSchema).min(1),
  skins: z.array(sessionSkinSchema).optional(),
});

export const updateSessionSchema = z.object({
  accounts_count: z.number().int().positive().optional(),
  total_value: z.number().nonnegative().optional(),
  total_cases: z.number().int().positive().optional(),
  avg_case_price: z.number().nonnegative().optional(),
  avg_drop_price: z.number().nonnegative().optional(),
  is_final: z.boolean().optional(),
  notes: z.string().optional(),
});
