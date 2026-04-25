import { db } from '@/db/client.js';
import { expenses } from '@/db/schema.js';
import { CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expenses.types.js';
import { desc, eq } from 'drizzle-orm';

export async function createExpense(data: CreateExpenseDTO) {
  const [expense] = await db
    .insert(expenses)
    .values({
      description: data.description,
      amount: String(data.amount),
      category: data.category,
      date: data.date,
    })
    .returning();
  return expense;
}

export async function getAllExpenses() {
  return await db.select().from(expenses).orderBy(desc(expenses.date));
}

export async function deleteExpense(id: number) {
  const [deletedExpense] = await db.delete(expenses).where(eq(expenses.id, id)).returning();
  return deletedExpense ?? null;
}

export async function updateExpense(id: number, data: UpdateExpenseDTO) {
  const values = {
    description: data.description,
    amount: data.amount != null ? String(data.amount) : undefined,
    category: data.category,
    date: data.date,
  };

  const set = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined));

  const [updatedExpense] = await db
    .update(expenses)
    .set(set)
    .where(eq(expenses.id, id))
    .returning();
  return updatedExpense ?? null;
}
